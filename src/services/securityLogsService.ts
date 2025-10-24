import supabase from "@/supabaseClient";

/**
 * Security Logs Service
 * Persists raw emails (per request) and malware scans (URL or file name) into Supabase tables via Node.js backend.
 * Tables expected:
 *  - public.Email_breach_checker (email_address text not null, date_time timestamptz default now())
 *  - public.Malware_scanner (url_or_file_name text not null)
 *
 * Note: scan_type is sent to backend for validation but not stored in database due to schema limitations.
 * Stats are calculated using pattern matching on url_or_file_name.
 */

// Use Vite env for client configuration; fall back to /api to leverage Vite proxy in dev
const API_BASE = (import.meta as any).env?.VITE_API_BASE?.toString() || '/api';

import { z } from 'zod';
import { sanitizeHtml, removeScriptTags, validateEmail, validateUrl, apiRequestLimiter, securityLogger } from '@/utils/security';

// Schemas for runtime validation
const EmailLogSchema = z.object({
  email_address: z.string().min(3).max(254).refine((v) => validateEmail(v), 'Invalid email')
});

const MalwareLogSchema = z.object({
  url_or_file_name: z.string().min(1).max(512),
  scan_type: z.enum(['url', 'file']).optional()
});

// Helper: sanitized payload builders
const buildEmailPayload = (email: string) => {
  const clean = sanitizeHtml(removeScriptTags(email.trim()));
  return { email_address: clean };
};

const buildMalwarePayload = (input: string, scanType?: 'url' | 'file') => {
  const cleaned = sanitizeHtml(removeScriptTags(input.trim()));
  // If it looks like a URL, ensure it is valid HTTPS; otherwise treat as filename
  if (/^https?:\/\//i.test(cleaned)) {
    if (!validateUrl(cleaned)) {
      throw new Error('Invalid or insecure URL provided');
    }
  }
  return {
    url_or_file_name: cleaned,
    scan_type: scanType
  };
};

// Basic retry helper with exponential backoff
async function withRetry<T>(fn: () => Promise<T>, retries = 2, baseDelayMs = 300): Promise<T> {
  let lastErr: any;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < retries) {
        const delay = baseDelayMs * Math.pow(2, i);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastErr;
}

export const securityLogsService = {
  async logEmailBreach(email: string) {
    // Client-side rate limit per identifier
    const limiterId = `email_breach_${email}`;
    if (!apiRequestLimiter.canMakeRequest(limiterId)) {
      securityLogger.logRateLimitExceeded(limiterId);
      return { ok: false, error: 'Rate limit exceeded. Please wait and try again.' } as const;
    }

    try {
      const payload = buildEmailPayload(email);
      EmailLogSchema.parse(payload);

      const doFetch = async () => {
        const response = await fetch(`${API_BASE}/be/email-breach/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          let errorMsg = 'Failed to log email breach';
          try { const d = await response.json(); errorMsg = d.error || errorMsg; } catch {}
          throw new Error(errorMsg);
        }
        return response.json();
      };

      return await withRetry(doFetch);
    } catch (error: any) {
      console.error('Error logging email breach:', error);
      // Fallback to direct Supabase if backend fails
      const { data, error: supabaseError } = await supabase
        .from('Email_breach_checker')
        .insert([{ email_address: buildEmailPayload(email).email_address }])
        .select()
        .single();

      if (supabaseError) {
        securityLogger.logSuspiciousActivity('email_breach_log_failure', { reason: supabaseError.message });
        throw supabaseError;
      }
      return data;
    }
  },

  async logMalwareScan(input: string, scanType?: 'url' | 'file') {
    const limiterId = `malware_scan_${input}`;
    if (!apiRequestLimiter.canMakeRequest(limiterId)) {
      securityLogger.logRateLimitExceeded(limiterId);
      return { ok: false, error: 'Rate limit exceeded. Please wait and try again.' } as const;
    }

    try {
      const payload = buildMalwarePayload(input, scanType);
      MalwareLogSchema.parse(payload);

      const doFetch = async () => {
        const response = await fetch(`${API_BASE}/be/malware-scan/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          let errorMsg = 'Failed to log malware scan';
          try { const d = await response.json(); errorMsg = d.error || errorMsg; } catch {}
          throw new Error(errorMsg);
        }
        return response.json();
      };

      return await withRetry(doFetch);
    } catch (error: any) {
      console.error('Error logging malware scan:', error);
      // Fallback to direct Supabase if backend fails
      const payload = buildMalwarePayload(input, scanType);
      const looksLikeUrl = /^https?:\/\//i.test(payload.url_or_file_name);
      const type = scanType || (looksLikeUrl ? 'url' : 'file');
      const { data, error: supabaseError } = await supabase
        .from('Malware_scanner')
        .insert([{ url_or_file_name: payload.url_or_file_name }])
        .select()
        .single();

      if (supabaseError) {
        securityLogger.logSuspiciousActivity('malware_scan_log_failure', { reason: supabaseError.message });
        throw supabaseError;
      }
      return data;
    }
  },
};

export default securityLogsService;
