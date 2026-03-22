# AEDI Backend API

This is the Node.js backend for the AEDI Security website, replacing the previous Django implementation. It provides API endpoints for logging email breach checks and malware scans, using Supabase as the database.

## Features

- **Email Breach Logging**: Record email addresses checked for breaches.
- **Malware Scan Logging**: Record URLs or file names scanned for malware, with automatic detection of URL vs file type based on file size (≥0.01MB = file) and URL patterns.
- **Statistics**: Get detailed counts of logged checks and scans, including separate counts for URL and file scans.
- **Health Check**: Simple health endpoint for monitoring.
- **Security**: Input validation, rate limiting, CORS protection, and SQL injection prevention.
- **Email Reports**: Send detailed breach reports via email with professional branding and company logo.

## Tech Stack

- **Node.js**: Runtime environment.
- **Express.js**: Web framework for API endpoints.
- **Supabase**: Database and authentication (via client library).
- **Zod**: Runtime type validation for API inputs.
- **Helmet**: Security middleware for HTTP headers.
- **Express Rate Limit**: IP-based rate limiting.
- **CORS**: For cross-origin requests.
- **Dotenv**: For environment variable management.
- **EmailJS**: Email service for sending breach reports.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory with the following:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=8000
   NODE_ENV=development
   ```

3. **Run the Server**:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:8000`.

4. **Development**:
   ```bash
   npm run dev
   ```
   Uses nodemon for auto-restart on changes.

## API Endpoints

Security defaults
- All endpoints behind basic IP rate limiting.
- JSON body limited to 10kb.
- CORS restricted to local dev origins by default; tighten in production.
- Inputs validated with Zod and sanitized before DB insert.

All endpoints are prefixed with `/be` for consistency with the previous Django setup.

### GET /be/health
- **Description**: Health check endpoint.
- **Response**: `{"status": "ok"}`

### POST /be/email-breach/check
- **Description**: Log an email breach check.
- **Body**:
  ```json
  {
    "email_address": "user@example.com"
  }
  ```
  - Validations: must be a valid email, max length 254.
- **Response**: `{"ok": true}`
- **Errors**: 400 for invalid payload, 500 for server/DB errors.

### POST /be/malware-scan/check
- **Description**: Log a malware scan.
- **Body**:
  ```json
  {
    "url_or_file_name": "https://example.com/file.exe",
    "scan_type": "url"  // optional: "url" or "file", auto-detected if not provided
  }
  ```
  - Validations: string required, max length 512. If the input looks like a URL, it should be HTTPS.
- **Response**: `{"ok": true}`
- **Errors**: 400 for invalid payload, 500 for server/DB errors.

### GET /be/stats
- **Description**: Get statistics on logged checks.
- **Response**:
  ```json
  {
    "email_breach_checks": 10,
    "malware_scans": 5,
    "malware_url_scans": 3,
    "malware_file_scans": 2
  }
  ```

## Email Functionality

The frontend includes EmailJS integration for sending professional breach reports via email:

### Features
- **Professional Email Templates**: HTML emails with AEDI Security branding and company logo
- **Comprehensive Reports**: Includes detailed breach analysis, security recommendations, and dark web exposure data
- **Responsive Design**: Email templates are mobile-friendly and professionally formatted
- **Automatic Delivery**: One-click email sending after breach analysis

### Email Template Includes
- Company logo and branding
- Personalized appreciation message
- Complete breach analysis report
- Security recommendations
- Contact information for professional services
- Professional footer with company details

### Configuration
EmailJS is configured in `src/config/emailjs.ts` with:
- Service ID: `service_ccbllzq`
- Template ID: `template_jeznh6e`
- Public Key: `xouy090qSXohX08Qu`
- Recipient: `info@aedisecurity.com`

## Database Schema

The backend uses Supabase tables defined in `supabase_schema.sql`:

- **Email_breach_checker**: `id`, `email_address`, `date_time`
- **Malware_scanner**: `id`, `url_or_file_name`

The backend automatically detects whether the input is a URL or file and counts them separately in the statistics.

## Deployment

For production, set `NODE_ENV=production` and update the `PORT` if necessary. Ensure Supabase credentials are set correctly.

## License

MIT