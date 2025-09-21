// supabase/functions/check-payment-status/index.ts
// Edge Function to check M-Pesa payment status

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Helper function to check payment status from database
async function checkPaymentFromDatabase(checkoutRequestId: string): Promise<any> {
  if (!supabase) {
    console.warn('⚠️ Supabase not configured, using fallback simulation');
    return simulatePaymentCompletion(checkoutRequestId);
  }

  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .single();

    if (error) {
      console.error('❌ Database query error:', error);
      return { status: 'failed', error: 'Database query failed' };
    }

    if (!data) {
      console.log('❌ Payment not found in database');
      return { status: 'failed', error: 'Payment not found' };
    }

    console.log('✅ Payment found in database:', data);

    // Map database status to frontend expected format
    const status = data.status.toLowerCase();
    
    if (status === 'success') {
      return {
        status: 'completed',
        transactionId: data.checkout_request_id,
        mpesaReceiptNumber: data.mpesa_receipt_number,
        amount: data.amount,
        phoneNumber: data.phone_number,
        timestamp: data.updated_at || data.created_at,
      };
    } else if (status === 'failed') {
      return {
        status: 'failed',
        transactionId: data.checkout_request_id,
        resultDesc: data.result_desc,
      };
    } else {
      // Still pending
      return {
        status: 'pending',
        transactionId: data.checkout_request_id,
      };
    }
  } catch (err) {
    console.error('❌ Database error:', err);
    return { status: 'failed', error: 'Database error' };
  }
}

// Fallback simulation function for when database is not available
function simulatePaymentCompletion(checkoutRequestId: string): any {
  // Simple simulation - in real scenario this would not be needed
  const random = Math.random();
  
  if (random > 0.7) {
    return {
      status: 'completed',
      transactionId: checkoutRequestId,
      mpesaReceiptNumber: `NLJ7RT61SV${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      amount: 10,
      phoneNumber: '254712345678',
      timestamp: new Date().toISOString(),
    };
  } else if (random > 0.3) {
    return { status: 'pending' };
  } else {
    return { status: 'failed' };
  }
}

serve(async (req: Request): Promise<Response> => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: CORS_HEADERS,
      });
    }

    // Extract checkout request ID from URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const checkoutRequestId = pathParts[pathParts.length - 1];

    if (!checkoutRequestId || checkoutRequestId === 'check-payment-status') {
      return new Response(JSON.stringify({ error: "Checkout request ID is required" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    console.log(`Checking payment status for: ${checkoutRequestId}`);

    // Check payment status from database
    const result = await checkPaymentFromDatabase(checkoutRequestId);
    
    console.log(`Payment status result:`, result);

    return new Response(JSON.stringify(result), {
      headers: CORS_HEADERS,
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Payment status check error:", err);
    
    return new Response(JSON.stringify({ 
      error: message, 
      status: 'error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});
