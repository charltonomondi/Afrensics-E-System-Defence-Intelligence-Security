// Supabase Edge Function: mpesa
//
// Routes (relative to the deployed function URL):
//   GET    /mpesa/health
//   POST   /mpesa/stk-push
//   POST   /mpesa/c2b/register-url
//   POST   /mpesa/callback/validation
//   POST   /mpesa/callback/confirmation
//
// Environment variables to configure in Supabase (Dashboard -> Functions -> Secrets), or via CLI:
//   MPESA_KEY               : Daraja consumer key
//   MPESA_SECRET            : Daraja consumer secret
//   MPESA_SHORTCODE         : PayBill or Till number (BusinessShortCode / PartyB)
//   MPESA_PASSKEY           : Daraja STK Push passkey (used for STK password)
//   MPESA_ENV               : "sandbox" (default) or "production"
//   MPESA_CALLBACK_URL      : Optional. If not set, defaults to this function URL + /callback/confirmation
//   MPESA_VALIDATION_URL    : Optional. If not set, defaults to this function URL + /callback/validation
//   MPESA_TRANSACTION_TYPE  : Optional. Default: "CustomerPayBillOnline" (use "CustomerBuyGoodsOnline" for Till)
//   CORS_ORIGIN             : Optional. Frontend origin for CORS (default "*")
//
// Local development with Supabase CLI:
//   supabase functions new mpesa
//   supabase functions secrets set MPESA_KEY=... MPESA_SECRET=... MPESA_SHORTCODE=... MPESA_PASSKEY=... MPESA_ENV=sandbox CORS_ORIGIN=http://localhost:8080
//   supabase functions serve mpesa --env-file <(supabase functions secrets list --include-values)
//
// Deploy:
//   supabase functions deploy mpesa
//   supabase functions secrets set ... (in project)
//   # Function URL example: https://<project-ref>.functions.supabase.co/mpesa

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?dts";

// Deno types for editor compatibility (avoid TS errors in non-Deno tooling)
// This only affects type-checking in editors; it does not impact runtime.
// @ts-ignore
declare const Deno: {
  env: { get(name: string): string | undefined };
};

// Supabase admin client (server-side only)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Explicit environment variables for M-Pesa integration (requested keys)
const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY")!;
const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET")!;
const shortcode = Deno.env.get("MPESA_SHORTCODE")!;
const passkey = Deno.env.get("MPESA_PASSKEY")!;
const partyA = Deno.env.get("MPESA_PARTY_A")!;
const partyB = Deno.env.get("MPESA_PARTY_B")!;
const phone = Deno.env.get("MPESA_PHONE")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function getSupabase() {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in function secrets.");
  }
  return supabaseAdmin;
}

// deno-lint-ignore no-explicit-any
function json(data: any, init?: ResponseInit) {
  const corsOrigin = Deno.env.get("CORS_ORIGIN") ?? "*";
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "authorization,content-type",
  });
  if (init?.headers) {
    const incoming = new Headers(init.headers);
    incoming.forEach((v, k) => headers.set(k, v));
  }
  return new Response(JSON.stringify(data), { ...(init ?? {}), headers });
}

function noContent(status = 204) {
  const corsOrigin = Deno.env.get("CORS_ORIGIN") ?? "*";
  return new Response(null, {
    status,
    headers: {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "authorization,content-type",
    },
  });
}

function badRequest(message: string) {
  return json({ error: message }, { status: 400 });
}

function unauthorized(message: string) {
  return json({ error: message }, { status: 401 });
}

function serverError(message: string, meta?: Record<string, unknown>) {
  return json({ error: message, ...(meta ?? {}) }, { status: 500 });
}

function getRequiredEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

function safaricomBaseUrl(): string {
  const env = (Deno.env.get("MPESA_ENV") ?? "sandbox").toLowerCase();
  return env === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

async function getAccessToken(): Promise<string> {
  const key = consumerKey || Deno.env.get("MPESA_KEY") || getRequiredEnv("MPESA_KEY");
  const secret = consumerSecret || Deno.env.get("MPESA_SECRET") || getRequiredEnv("MPESA_SECRET");
  const base = safaricomBaseUrl();

  const auth = btoa(`${key}:${secret}`);
  const tokenRes = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`Failed to get access token: ${tokenRes.status} ${text}`);
  }
  const tokenData = await tokenRes.json();
  const accessToken = tokenData?.access_token as string | undefined;
  if (!accessToken) throw new Error("Missing access_token in token response");
  return accessToken;
}

function yyyymmddHHMMSS(date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function makeStkPassword(shortcode: string, passkey: string, timestamp: string): string {
  // Base64(BusinessShortCode + Passkey + Timestamp)
  const raw = `${shortcode}${passkey}${timestamp}`;
  // btoa works on ASCII only; Daraja tokens are ASCII-safe.
  return btoa(raw);
}

function getShortcode(): string {
  const env = (Deno.env.get("MPESA_ENV") ?? "sandbox").toLowerCase();
  const sc = Deno.env.get("MPESA_SHORTCODE");
  if (sc && sc.trim()) return sc.trim();
  if (env === "sandbox") return "174379"; // default sandbox STK Push shortcode
  throw new Error("Missing required env: MPESA_SHORTCODE");
}

function normalizeMsisdn(msisdn: string): string {
  // Normalize Kenyan numbers to 2547XXXXXXXX or 2541XXXXXXXX format
  let s = msisdn.trim();
  if (s.startsWith("+")) s = s.slice(1);
  if (s.startsWith("0")) s = `254${s.slice(1)}`;
  if (s.startsWith("7") || s.startsWith("1")) s = `254${s}`;
  return s;
}

async function handleHealth(): Promise<Response> {
  return json({ ok: true, service: "mpesa", env: Deno.env.get("MPESA_ENV") ?? "sandbox" });
}

function maskSecret(value?: string | null): string {
  if (!value) return "<unset>";
  const v = String(value);
  if (v.length <= 8) return "*".repeat(v.length);
  return `${v.slice(0, 4)}...${v.slice(-4)}`;
}

async function handleDebugEnv(): Promise<Response> {
  // Do NOT expose raw secrets. This endpoint masks values for diagnostics.
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const mpesaKey = Deno.env.get("MPESA_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const mpesaSecretSet = !!Deno.env.get("MPESA_SECRET");
  const passkeySet = !!Deno.env.get("MPESA_PASSKEY");
  const shortcode = getShortcode();

  return json({
    ok: true,
    env: Deno.env.get("MPESA_ENV") ?? "sandbox",
    supabaseUrl: maskSecret(supabaseUrl ?? undefined),
    serviceRoleKey: maskSecret(serviceRoleKey ?? undefined),
    mpesaKey: maskSecret(mpesaKey ?? undefined),
    mpesaSecret: mpesaSecretSet ? "<set>" : "<unset>",
    mpesaPasskey: passkeySet ? "<set>" : "<unset>",
    shortcode,
  });
}

async function handleRegisterUrl(req: Request): Promise<Response> {
  try {
    const base = safaricomBaseUrl();
    const accessToken = await getAccessToken();

    const { origin, pathname } = new URL(req.url);
    const functionBase = `${origin}${pathname.split("/")[1] ? "" : ""}`; // origin only
    const functionRoot = `${origin}/mpesa`;

    const shortcode = getShortcode();
    const confirmationUrl = Deno.env.get("MPESA_CALLBACK_URL") ?? `${functionRoot}/callback/confirmation`;
    const validationUrl = Deno.env.get("MPESA_VALIDATION_URL") ?? `${functionRoot}/callback/validation`;

    const body = {
      ShortCode: shortcode,
      ResponseType: "Completed",
      ConfirmationURL: confirmationUrl,
      ValidationURL: validationUrl,
    };

    const res = await fetch(`${base}/mpesa/c2b/v1/registerurl`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return serverError("Failed to register URLs", { status: res.status, data });
    }

    return json({ ok: true, data });
  } catch (e) {
    return serverError((e as Error).message);
  }
}

// deno-lint-ignore no-explicit-any
async function handleStkPush(req: Request): Promise<Response> {
  try {
    const base = safaricomBaseUrl();
    const accessToken = await getAccessToken();
    const shortcode = getShortcode();
    const mpesaPasskey = passkey || getRequiredEnv("MPESA_PASSKEY");
    const txType = Deno.env.get("MPESA_TRANSACTION_TYPE") ?? "CustomerPayBillOnline"; // or "CustomerBuyGoodsOnline"

    const { origin } = new URL(req.url);
    const functionRoot = `${origin}/mpesa`;

    const { amount, phoneNumber, accountReference, description } = await req.json();
    if (!amount || !phoneNumber) return badRequest("amount and phoneNumber are required");

    const timestamp = yyyymmddHHMMSS();
    const password = makeStkPassword(shortcode, mpesaPasskey, timestamp);
    const msisdn = normalizeMsisdn(String(phoneNumber));

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: txType,
      Amount: Number(amount),
      PartyA: (partyA && partyA.trim()) ? partyA.trim() : msisdn,
      PartyB: (partyB && partyB.trim()) ? partyB.trim() : shortcode, // for PayBill and Till this can be the same shortcode
      PhoneNumber: msisdn,
      CallBackURL: Deno.env.get("MPESA_CALLBACK_URL") ?? `${functionRoot}/callback/confirmation`,
      AccountReference: accountReference ?? "Afrensics",
      TransactionDesc: description ?? "Payment",
    };

    const res = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return serverError("STK Push request failed", { status: res.status, data });
    }

    // Log payment as Pending in Supabase
    try {
      const { error: dbErr } = await getSupabase()
        .from("payments")
        .insert([
          {
            phone_number: msisdn,
            amount: Number(amount),
            status: "Pending",
            checkout_request_id: data?.CheckoutRequestID ?? null,
            merchant_request_id: data?.MerchantRequestID ?? null,
            account_reference: accountReference ?? "Afrensics",
            description: description ?? "Payment",
            env: Deno.env.get("MPESA_ENV") ?? "sandbox",
          },
        ]);
      if (dbErr) {
        console.warn("[mpesa] Failed to log payment to Supabase:", dbErr);
      }
    } catch (e) {
      console.warn("[mpesa] Payment logging error:", e);
    }

    return json({ ok: true, data });
  } catch (e) {
    return serverError((e as Error).message);
  }
}

// SafariCom will POST to these endpoints with JSON payloads.
// We simply acknowledge receipt. Persisting should be done via server DB if needed.
// deno-lint-ignore no-explicit-any
async function handleValidationCallback(req: Request): Promise<Response> {
  try {
    const payload = await req.json();
    // Minimal logging; avoid storing PII client-side. Replace with server-side persistence if needed.
    console.log("[M-Pesa Validation]", { id: crypto.randomUUID(), event: payload?.TransID ?? payload?.TransactionID ?? "" });
    // Per Daraja, respond with ResultCode 0 to accept.
    return json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (e) {
    // If body is not JSON, still accept to avoid blocking payments; adjust as needed.
    console.warn("Validation callback parse error", e);
    return json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}

// deno-lint-ignore no-explicit-any
async function handleConfirmationCallback(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const stk = body?.Body?.stkCallback;
    const checkoutId = stk?.CheckoutRequestID;
    const resultCode = Number(stk?.ResultCode ?? -1);
    const resultDesc = String(stk?.ResultDesc ?? "");
    const items = stk?.CallbackMetadata?.Item ?? [];
    // deno-lint-ignore no-explicit-any
    const getMeta = (name: string) => items.find((i: any) => i?.Name === name)?.Value;
    const receipt = getMeta("MpesaReceiptNumber");
    const phone = String(getMeta("PhoneNumber") ?? "");
    const amount = Number(getMeta("Amount") ?? 0);

    console.log("[M-Pesa Confirmation]", { id: crypto.randomUUID(), checkoutId, resultCode, resultDesc, receipt, phone, amount });

    // Update payment in Supabase
    try {
      const update: Record<string, unknown> = {
        status: resultCode === 0 ? "Success" : "Failed",
        result_code: resultCode,
        result_desc: resultDesc,
        mpesa_receipt_number: receipt ?? null,
      };

      let query = getSupabase().from("payments").update(update);
      if (checkoutId) {
        query = query.eq("checkout_request_id", checkoutId);
      } else if (phone && amount) {
        query = query.eq("phone_number", phone).eq("amount", amount);
      }
      const { error: dbErr } = await query;
      if (dbErr) console.warn("[mpesa] Supabase update error:", dbErr);
    } catch (dbErr) {
      console.warn("[mpesa] Callback update exception:", dbErr);
    }

    // Acknowledge receipt to Daraja
    return json({ ResultCode: 0, ResultDesc: "Received" });
  } catch (e) {
    console.warn("Confirmation callback parse error", e);
    return json({ ResultCode: 0, ResultDesc: "Received" });
  }
}

function notFound() {
  return json({ error: "Not Found" }, { status: 404 });
}

function methodNotAllowed() {
  return json({ error: "Method Not Allowed" }, { status: 405 });
}

// Request router
serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") return noContent(204);

  const url = new URL(req.url);
  // Pathname examples:
  //   /mpesa
  //   /mpesa/stk-push
  //   /mpesa/c2b/register-url
  //   /mpesa/callback/validation
  //   /mpesa/callback/confirmation

  const path = url.pathname.replace(/\/+$/, ""); // strip trailing slash

  try {
    if (req.method === "GET" && (path === "/mpesa" || path === "/mpesa/health")) {
      return handleHealth();
    }

    if (req.method === "GET" && path === "/mpesa/debug-env") {
      return handleDebugEnv();
    }

    if (req.method === "POST" && path === "/mpesa/c2b/register-url") {
      return handleRegisterUrl(req);
    }

    if (req.method === "POST" && path === "/mpesa/stk-push") {
      return handleStkPush(req);
    }

    if (req.method === "POST" && path === "/mpesa/callback/validation") {
      return handleValidationCallback(req);
    }

    if (req.method === "POST" && path === "/mpesa/callback/confirmation") {
      return handleConfirmationCallback(req);
    }

    // Root POST fallback not allowed
    if (req.method === "POST" && path === "/mpesa") {
      return methodNotAllowed();
    }

    return notFound();
  } catch (e) {
    return serverError((e as Error).message);
  }
});
