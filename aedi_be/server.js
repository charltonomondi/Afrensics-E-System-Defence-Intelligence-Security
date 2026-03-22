const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security & middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [undefined, 'http://localhost:8080', 'http://localhost:5173', 'http://localhost:8081'];
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
const BreachReportSchema = z.object({
  email: z.string().email(),
  detailedResult: z.object({
    email: z.string().email(),
    isBreached: z.boolean(),
    breachCount: z.number(),
    breaches: z.array(z.object({
      name: z.string(),
      title: z.string(),
      breachDate: z.string(),
      pwnCount: z.number(),
      description: z.string(),
      dataClasses: z.array(z.string()),
      isVerified: z.boolean(),
      isSensitive: z.boolean(),
    })),
    riskScore: z.number(),
    lastChecked: z.string(),
    recommendations: z.array(z.string()),
    darkWeb: z.object({
      found: z.boolean(),
      sources: z.array(z.string()),
      vectors: z.array(z.string()),
      notes: z.array(z.string()),
    }).optional(),
  }),
});

// PostgreSQL client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Or individual: host, user, password, database, port
});

// Gmail SMTP transporter using port 587 with TLS
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // For STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
});

// Log transporter configuration for debugging (without password)
console.log('Transporter configuration:', {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: process.env.SMTP_USER,
  // Do not log password for security
});

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

    const client = await pool.connect();
    try {
      const query = 'INSERT INTO Email_breach_checker (email_address, date_time) VALUES ($1, $2)';
      const values = [sanitize(parsed.data.email_address), new Date()];
      await client.query(query, values);
      res.json({ ok: true });
    } finally {
      client.release();
    }
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

    const client = await pool.connect();
    try {
      const query = 'INSERT INTO Malware_scanner (url_or_file_name) VALUES ($1)';
      const values = [value];
      await client.query(query, values);
      res.json({ ok: true });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send breach report email
app.post('/be/send-breach-report', async (req, res) => {
  console.log('Received request to /be/send-breach-report');

  try {
    const parsed = BreachReportSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error('Invalid request data:', parsed.error);
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const { email, detailedResult } = parsed.data;

    // Generate HTML email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Afrensics Security Ltd - Breach Report</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .tagline { font-size: 14px; opacity: 0.9; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .breach-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 15px 0; }
          .breach-header { color: #dc2626; font-weight: bold; font-size: 18px; margin-bottom: 10px; }
          .breach-detail { margin: 8px 0; font-size: 14px; }
          .recommendations { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🛡️ Afrensics Security Ltd</div>
          <div class="tagline">Professional Cybersecurity Services</div>
        </div>

        <div class="content">
          <h2 style="color: #1e40af; text-align: center; margin-bottom: 30px;">Thank You for Using AEDI Security Breach Checker!</h2>

          <p>Dear Valued User,</p>

          <p>Thank you for trusting <strong>AEDI Security Ltd</strong> with your cybersecurity needs. We're committed to helping you stay safe in the digital world.</p>

          <p>Below is your comprehensive breach analysis report for: <strong>${email}</strong></p>

          ${detailedResult.isBreached ?
            `<div class="breach-card">
              <div class="breach-header">⚠️ SECURITY ALERT: Breaches Detected</div>
              <p><strong>Risk Level:</strong> ${detailedResult.riskScore >= 70 ? 'HIGH' : detailedResult.riskScore >= 40 ? 'MEDIUM' : 'LOW'}</p>
              <p><strong>Breaches Found:</strong> ${detailedResult.breachCount}</p>

              ${detailedResult.breaches.map(breach => `
                <div style="margin: 15px 0; padding: 15px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;">
                  <h4 style="color: #dc2626; margin: 0 0 10px 0;">${breach.title || breach.name}</h4>
                  <p style="margin: 5px 0;"><strong>Breach Date:</strong> ${new Date(breach.breachDate).toLocaleDateString()}</p>
                  <p style="margin: 5px 0;"><strong>Accounts Affected:</strong> ${breach.pwnCount.toLocaleString()}</p>
                  <p style="margin: 5px 0;"><strong>Description:</strong> ${breach.description}</p>
                  ${breach.dataClasses.length > 0 ? `<p style="margin: 5px 0;"><strong>Data Exposed:</strong> ${breach.dataClasses.join(', ')}</p>` : ''}
                </div>
              `).join('')}

              ${detailedResult.darkWeb?.found ?
                `<div style="margin: 15px 0; padding: 15px; background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px;">
                  <h4 style="color: #0c4a6e;">🌐 Dark Web Exposure Detected</h4>
                  ${detailedResult.darkWeb.sources?.length ? `<p><strong>Sources:</strong> ${detailedResult.darkWeb.sources.join(', ')}</p>` : ''}
                  ${detailedResult.darkWeb.vectors?.length ? `<p><strong>Exposure Methods:</strong> ${detailedResult.darkWeb.vectors.join(', ')}</p>` : ''}
                  <p><strong>Recommendation:</strong> ${detailedResult.darkWeb.notes?.join(' ')}</p>
                </div>` : ''
              }
            </div>` :

            `<div class="breach-card" style="background: #f0fdf4; border: 1px solid #bbf7d0;">
              <div style="color: #16a34a; font-weight: bold; font-size: 18px;">✅ Great News!</div>
              <p>No breaches found for this email address. Your account appears to be secure.</p>
            </div>`
          }

          <div class="recommendations">
            <h4 style="color: #92400e; margin: 0 0 15px 0;">🛡️ Security Recommendations</h4>
            <ul style="margin: 0; padding-left: 20px;">
              ${detailedResult.recommendations.map(rec => `<li style="margin: 8px 0;">${rec}</li>`).join('')}
            </ul>
          </div>

          <p><strong>Check Date:</strong> ${new Date(detailedResult.lastChecked).toLocaleString()}</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://aedisecurity.com" class="button">Visit AEDI Security</a>
          </div>

          <p>If you have any questions or need professional cybersecurity assistance, please don't hesitate to contact us:</p>
          <ul>
            <li><strong>Phone:</strong> +254708759251</li>
            <li><strong>Email:</strong> info@aedisecurity.com</li>
            <li><strong>Website:</strong> https://aedisecurity.com</li>
          </ul>

          <p>Stay safe online!</p>
          <p><strong>The Afrensics Security Team</strong></p>
        </div>

        <div class="footer">
          <p>© 2025 Afrensics Security Ltd. All rights reserved.</p>
          <p>This report was generated by AEDI Security's free breach checking tool.</p>
          <p>Professional cybersecurity services available at <a href="https://aedisecurity.com">aedisecurity.com</a></p>
        </div>
      </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: process.env.SMTP_USER, // Use afrensics@gmail.com
      to: email,
      subject: `Afrensics Security Breach Report - ${detailedResult.isBreached ? 'Breaches Detected' : 'No Breaches Found'}`,
      html: emailTemplate,
    };

    console.log('Attempting to send breach report email to:', email);
    console.log('From:', process.env.SMTP_USER);
    console.log('Breach detected (isBreached):', detailedResult.isBreached);
    console.log('Breach count:', detailedResult.breachCount);
    console.log('Mail options (without html):', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      // Do not log html for brevity
    });

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully to:', email);
  
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending failed:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Error response code:', error.responseCode);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Get stats
app.get('/be/stats', async (req, res) => {
  console.log('Received request to /be/stats');
  const client = await pool.connect();
  try {
    console.log('Fetching email breach count...');
    const emailResult = await client.query('SELECT COUNT(*) as count FROM Email_breach_checker');
    const emailCount = parseInt(emailResult.rows[0].count);

    console.log('Email count:', emailCount);

    console.log('Fetching malware scan count...');
    const malwareResult = await client.query('SELECT COUNT(*) as count FROM Malware_scanner');
    const malwareTotal = parseInt(malwareResult.rows[0].count);

    console.log('Malware total:', malwareTotal);

    // Count URLs and files by length: >=20 characters as URL, else file
    console.log('Fetching all scans for URL/file count...');
    const allScansResult = await client.query('SELECT url_or_file_name FROM Malware_scanner');
    const allScans = allScansResult.rows;

    console.log('All scans:', allScans);

    let malwareUrlCount = 0;
    let malwareFileCount = 0;

    if (allScans) {
      malwareUrlCount = allScans.filter(scan => scan.url_or_file_name && scan.url_or_file_name.length >= 20).length;
      malwareFileCount = allScans.length - malwareUrlCount;
    }

    console.log('Malware URL count:', malwareUrlCount, 'File count:', malwareFileCount);

    const response = {
      email_breach_checks: emailCount || 0,
      malware_scans: malwareTotal || 0,
      malware_url_scans: malwareUrlCount || 0,
      malware_file_scans: malwareFileCount || 0,
    };

    console.log('Sending stats response:', response);
    res.json(response);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Verify transporter
transporter.verify(function(error, success) {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Transporter is ready to send emails');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});