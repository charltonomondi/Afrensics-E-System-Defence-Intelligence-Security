const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security & middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [undefined, 'http://localhost:8080', 'http://localhost:5173'];
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));

// Basic rate limiting per IP on /be routes
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false });
app.use('/be/', limiter);

// Validation schemas
const EmailLogSchema = z.object({ email_address: z.string().email().max(254) });
const MalwareLogSchema = z.object({
  url_or_file_name: z.string().min(1).max(1024),
  scan_type: z.enum(['url', 'file']).optional()
});

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Health endpoint
app.get('/be/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Simple sanitizer for strings
const sanitize = (s) => typeof s === 'string' ? s.replace(/[\0\x08\x09\x1a\n\r"'\\%]/g, (c) => {
  switch (c) {
    case "\0": return "\\0";
    case "\x08": return "\\b";
    case "\x09": return "\\t";
    case "\x1a": return "\\z";
    case "\n": return "\\n";
    case "\r": return "\\r";
    case '"':
    case "'":
    case "\\":
    case "%":
      return "\\"+c;
    default:
      return c;
  }
}) : s;

// Record email breach check
app.post('/be/email-breach/check', async (req, res) => {
  try {
    const parsed = EmailLogSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid email_address' });
    }

    const now = new Date().toISOString();
    const { error } = await supabase
      .from('Email_breach_checker')
      .insert({
        email_address: sanitize(parsed.data.email_address),
        date_time: now,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record malware scan
app.post('/be/malware-scan/check', async (req, res) => {
  try {
    const parsed = MalwareLogSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid url_or_file_name or scan_type' });
    }

    const raw = parsed.data.url_or_file_name.trim();
    const value = sanitize(raw);

    // Use provided scan_type or auto-detect
    let type = parsed.data.scan_type;
    if (!type) {
      // Distinguish URL vs File using robust detection
      const looksLikeUrl = /^https?:\/\//i.test(value);
      type = looksLikeUrl ? 'url' : 'file';

      // Extra hardening: for URLs, require valid URL parse and https
      if (type === 'url') {
        try {
          const u = new URL(value);
          if (u.protocol !== 'https:') {
            // downgrade to file if not https
            type = 'file';
          }
        } catch {
          type = 'file';
        }
      }
    }

    const { error } = await supabase
      .from('Malware_scanner')
      .insert({
        url_or_file_name: value,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stats
app.get('/be/stats', async (req, res) => {
  try {
    const { count: emailCount, error: emailError } = await supabase
      .from('Email_breach_checker')
      .select('*', { count: 'exact', head: true });

    const { count: malwareTotal, error: malwareError } = await supabase
      .from('Malware_scanner')
      .select('*', { count: 'exact', head: true });

    // Count URLs and files by pattern since scan_type column doesn't exist
    const { data: allScans } = await supabase
      .from('Malware_scanner')
      .select('url_or_file_name');

    let malwareUrlCount = 0;
    let malwareFileCount = 0;

    if (allScans) {
      malwareUrlCount = allScans.filter(scan => /^https?:\/\//i.test(scan.url_or_file_name)).length;
      malwareFileCount = allScans.length - malwareUrlCount;
    }

    if (emailError || malwareError) {
      const err = emailError?.message || malwareError?.message;
      return res.status(500).json({ error: err });
    }

    res.json({
      email_breach_checks: emailCount || 0,
      malware_scans: malwareTotal || 0,
      malware_url_scans: malwareUrlCount || 0,
      malware_file_scans: malwareFileCount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});