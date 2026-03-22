// supabase/functions/mpesa-backup/index.ts
// Backup M-Pesa function with enhanced error handling and fallback simulation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Environment variables with multiple fallback names
const CONSUMER_KEY = Deno.env.get("MPESA_CONSUMER_KEY") || 
                     Deno.env.get("MPESA_KEY") || 
                     Deno.env.get("SAFARICOM_CONSUMER_KEY");

const CONSUMER_SECRET = Deno.env.get("MPESA_CONSUMER_SECRET") || 
                        Deno.env.get("MPESA_SECRET") || 
                        Deno.env.get("SAFARICOM_CONSUMER_SECRET");

const PASSKEY = Deno.env.get("MPESA_PASSKEY") || 
                Deno.env.get("SAFARICOM_PASSKEY");

const SHORTCODE = Deno.env.get("MPESA_SHORTCODE") || "174379";
const ENV = Deno.env.get("MPESA_ENV") || "sandbox";
const CALLBACK_URL = Deno.env.get("MPESA_CALLBACK_URL") || 
                     "https://ctyoktgzxqmeqzhmwpro.functions.supabase.co/mpesa-callback";

// Enable simulation mode if credentials are missing
const SIMULATION_MODE = !CONSUMER_KEY || !CONSUMER_SECRET || !PASSKEY;

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
  return digits;
}

function generateCheckoutRequestId(): string {
  return `ws_CO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Simulation function for when credentials are missing
function simulateSTKPush(phone: string, amount: number): any {
  console.log("🎭 SIMULATION MODE: Generating mock STK Push response");
  
  return {
    success: true,
    checkoutRequestId: generateCheckoutRequestId(),
    merchantRequestId: `ws_MR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    raw: {
      MerchantRequestID: `ws_MR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      CheckoutRequestID: generateCheckoutRequestId(),
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      CustomerMessage: "Success. Request accepted for processing"
    },
    simulation: true,
    message: "This is a simulated response. Set M-Pesa credentials for real integration."
  };
}

async function getAccessToken(): Promise<string> {
  if (SIMULATION_MODE) {
    console.log("🎭 SIMULATION MODE: Returning mock access token");
    return "mock_access_token_" + Date.now();
  }

  const basicAuth = "Basic " + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
  
  console.log(`Requesting access token from: ${BASE_URL}/oauth/v1/generate`);
  
  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: basicAuth },
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

    type Body = { phone: string; amount: number; email?: string; description?: string };
    const { phone, amount, email, description }: Body = await req.json();

    if (!phone || !amount) {
      return new Response(JSON.stringify({ error: "Phone number and amount are required" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const msisdn = normalizeMsisdn(phone);
    console.log(`Processing payment request: ${msisdn}, KES ${amount}`);

    // Check if we're in simulation mode
    if (SIMULATION_MODE) {
      console.log("🎭 SIMULATION MODE ACTIVE - Missing M-Pesa credentials");
      const simulatedResponse = simulateSTKPush(msisdn, amount);
      
      return new Response(JSON.stringify(simulatedResponse), {
        headers: CORS_HEADERS,
      });
    }

    // Real M-Pesa integration
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
      return new Response(JSON.stringify({ 
        success: false, 
        error: message, 
        raw: data,
        troubleshooting: {
          suggestion: "Check your M-Pesa credentials and phone number format",
          phone: msisdn,
          environment: ENV,
          shortcode: SHORTCODE
        }
      }), {
        status: 400,
        headers: CORS_HEADERS,
      });
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
    console.error("Function error:", err);
    
    return new Response(JSON.stringify({ 
      error: message, 
      success: false,
      timestamp: new Date().toISOString(),
      environment: {
        hasConsumerKey: !!CONSUMER_KEY,
        hasConsumerSecret: !!CONSUMER_SECRET,
        hasPasskey: !!PASSKEY,
        shortcode: SHORTCODE,
        environment: ENV,
        simulationMode: SIMULATION_MODE
      }
    }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});
