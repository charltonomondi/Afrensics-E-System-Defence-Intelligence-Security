// supabase/functions/initiate-mpesa-payment/index.ts
// Edge Function to initiate M-Pesa STK Push using Safaricom APIs.
// Accepts { phone, amount, email?, description? } and returns the raw API response or structured success.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Environment variables (configure via Supabase secrets)
const CONSUMER_KEY = Deno.env.get("MPESA_KEY"); // Safaricom Consumer Key
const CONSUMER_SECRET = Deno.env.get("MPESA_SECRET"); // Safaricom Consumer Secret
const PASSKEY = Deno.env.get("MPESA_PASSKEY"); // STK Passkey
const SHORTCODE = Deno.env.get("MPESA_SHORTCODE") || "174379"; // BusinessShortCode (default demo)
const ENV = Deno.env.get("MPESA_ENV") || "sandbox"; // "sandbox" | "production"
const CALLBACK_URL = Deno.env.get("MPESA_CALLBACK_URL") || "https://yourdomain.com/api/callback";

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
    throw new Error("Missing MPESA_KEY or MPESA_SECRET environment variables");
  }
  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: basicAuthHeader(CONSUMER_KEY, CONSUMER_SECRET) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAuth token request failed (${res.status}): ${text}`);
  }
  const data = await res.json();
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

    if (!PASSKEY) {
      return new Response(JSON.stringify({ error: "Server misconfiguration: MPESA_PASSKEY is missing" }), {
        status: 500,
        headers: CORS_HEADERS,
      });
    }

    type Body = { phone: string; amount: number; email?: string; description?: string };
    const { phone, amount, email, description }: Body = await req.json();

    if (!phone || !amount) {
      return new Response(JSON.stringify({ error: "Phone number and amount are required" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const msisdn = normalizeMsisdn(phone);
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

    const response = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.errorCode || data.errorMessage) {
      const message = data.errorMessage || data.errorCode || `STK request failed (${response.status})`;
      return new Response(JSON.stringify({ success: false, error: message, raw: data }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    return new Response(JSON.stringify({ success: true, checkoutRequestId: data.CheckoutRequestID, merchantRequestId: data.MerchantRequestID, raw: data }), {
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
