import { createClient } from '@supabase/supabase-js';

// Prefer Vite env vars; fall back to provided values if not set (e.g., in quick experiments).
// Add these to your .env files:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://ctyoktgzxqmeqzhmwpro.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0eW9rdGd6eHFtZXF6aG13cHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTI1ODEsImV4cCI6MjA3MjMyODU4MX0.Zf7Ka8g5-vVTQnmRZSUWb0nK747dm2GaXJR5UJrpH1E';

if ((!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && import.meta.env.DEV) {
  // Dev-only hint to move credentials to env vars per project best practices
  console.warn('[supabase] Using hardcoded fallback values. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env files.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
