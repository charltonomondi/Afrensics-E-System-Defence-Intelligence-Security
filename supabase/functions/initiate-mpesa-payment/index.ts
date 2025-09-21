// supabase/functions/initiate-mpesa-payment/index.ts
// Edge Function to initiate M-Pesa STK Push using Safaricom APIs.
// Accepts { phone, amount, email?, description? } and returns the raw API response or structured success.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Environment variables (configure via Supabase secrets)
// Try multiple possible environment variable names for flexibility
const CONSUMER_KEY = Deno.env.get("MPESA_CONSUMER_KEY") || Deno.env.get("MPESA_KEY");
const CONSUMER_SECRET = Deno.env.get("MPESA_CONSUMER_SECRET") || Deno.env.get("MPESA_SECRET");
const PASSKEY = Deno.env.get("MPESA_PASSKEY");
const SHORTCODE = Deno.env.get("MPESA_SHORTCODE") || "174379"; // BusinessShortCode (default demo)
const ENV = Deno.env.get("MPESA_ENV") || "sandbox"; // "sandbox" | "production"
const CALLBACK_URL = Deno.env.get("MPESA_CALLBACK_URL") || "https://ctyoktgzxqmeqzhmwpro.functions.supabase.co/mpesa-callback";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const BASE_URL = ENV === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function formatTimestamp(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${y}${m}${d}${hh}${mm}${ss}`;
}

function normalizeMsisdn(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("07") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith("01") && digits.length === 10) return `254${digits.slice(1)}`;
  return digits; // as-is
}

function basicAuthHeader(key: string, secret: string): string {
  return "Basic " + btoa(`${key}:${secret}`);
}

async function getAccessToken(): Promise<string> {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error(`Missing M-Pesa credentials. CONSUMER_KEY: ${CONSUMER_KEY ? 'SET' : 'MISSING'}, CONSUMER_SECRET: ${CONSUMER_SECRET ? 'SET' : 'MISSING'}`);
  }

  console.log(`Requesting access token from: ${BASE_URL}/oauth/v1/generate`);

  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: basicAuthHeader(CONSUMER_KEY, CONSUMER_SECRET) },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`OAuth token request failed (${res.status}):`, text);
    throw new Error(`OAuth token request failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  console.log('OAuth response received:', { hasAccessToken: !!data.access_token });

  if (!data.access_token) throw new Error("No access_token in OAuth response");
  return data.access_token as string;
}

serve(async (req: Request): Promise<Response> => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: CORS_HEADERS,
      });
    }

    // Enhanced environment variable validation
    const missingVars = [];
    if (!CONSUMER_KEY) missingVars.push("MPESA_CONSUMER_KEY");
    if (!CONSUMER_SECRET) missingVars.push("MPESA_CONSUMER_SECRET");
    if (!PASSKEY) missingVars.push("MPESA_PASSKEY");

    if (missingVars.length > 0) {
      console.error("Missing environment variables:", missingVars);
      return new Response(JSON.stringify({
        error: `Server misconfiguration: Missing environment variables: ${missingVars.join(', ')}`,
        details: "Please set the required M-Pesa environment variables in Supabase function secrets"
      }), {
        status: 500,
        headers: CORS_HEADERS,
      });
    }

    console.log(`M-Pesa STK Push request received. Environment: ${ENV}, Shortcode: ${SHORTCODE}`);

    type Body = { phone: string; amount: number; email?: string; description?: string };
    const { phone, amount, email, description }: Body = await req.json();

    if (!phone || !amount) {
      return new Response(JSON.stringify({ error: "Phone number and amount are required" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const msisdn = normalizeMsisdn(phone);
    console.log(`Normalized phone number: ${phone} -> ${msisdn}`);

    const token = await getAccessToken();
    const timestamp = formatTimestamp();
    const password = btoa(`${SHORTCODE}${PASSKEY}${timestamp}`);

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount),
      PartyA: msisdn,
      PartyB: SHORTCODE,
      PhoneNumber: msisdn,
      CallBackURL: CALLBACK_URL,
      AccountReference: email || "Test123",
      TransactionDesc: description || "Payment",
    };

    console.log(`STK Push payload:`, {
      ...payload,
      Password: "[REDACTED]"
    });

    const response = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(`STK Push response (${response.status}):`, data);

    if (!response.ok || data.errorCode || data.errorMessage) {
      const message = data.errorMessage || data.errorCode || `STK request failed (${response.status})`;
      return new Response(JSON.stringify({ success: false, error: message, raw: data }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    // Store payment initiation data in Supabase database
    if (supabase) {
      try {
        const { error: dbError } = await supabase
          .from('payments')
          .insert([
            {
              checkout_request_id: data.CheckoutRequestID,
              merchant_request_id: data.MerchantRequestID,
              phone_number: msisdn,
              amount: Number(amount),
              email: email || null,
              account_reference: email || "Afrensics",
              description: description || "AEDI Security - Detailed Breach Analysis",
              status: 'Pending',
              env: ENV === "production" ? "production" : "sandbox",
            }
          ]);
        
        if (dbError) {
          console.error('❌ Failed to store payment in database:', dbError);
        } else {
          console.log('✅ Payment stored in database successfully');
        }
      } catch (dbErr) {
        console.error('❌ Database error:', dbErr);
      }
    } else {
      console.warn('⚠️ Supabase not configured, payment not stored in database');
    }

    return new Response(JSON.stringify({
      success: true,
      checkoutRequestId: data.CheckoutRequestID,
      merchantRequestId: data.MerchantRequestID,
      raw: data
    }), {
      headers: CORS_HEADERS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message, success: false }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});
