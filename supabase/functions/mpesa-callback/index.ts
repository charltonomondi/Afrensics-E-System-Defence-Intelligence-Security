// supabase/functions/mpesa-callback/index.ts
// M-Pesa callback handler for payment confirmations

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface MpesaCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

function extractCallbackData(body: MpesaCallbackBody) {
  const callback = body.Body.stkCallback;
  const items = callback.CallbackMetadata?.Item || [];
  
  const getMetaValue = (name: string) => {
    const item = items.find(i => i.Name === name);
    return item?.Value;
  };

  return {
    merchantRequestId: callback.MerchantRequestID,
    checkoutRequestId: callback.CheckoutRequestID,
    resultCode: callback.ResultCode,
    resultDesc: callback.ResultDesc,
    mpesaReceiptNumber: getMetaValue("MpesaReceiptNumber") as string,
    transactionDate: getMetaValue("TransactionDate") as string,
    phoneNumber: getMetaValue("PhoneNumber") as string,
    amount: Number(getMetaValue("Amount")) || 0,
  };
}

async function handleCallback(req: Request): Promise<Response> {
  try {
    console.log("📞 M-Pesa callback received");
    
    const body: MpesaCallbackBody = await req.json();
    console.log("📞 Callback body:", JSON.stringify(body, null, 2));
    
    const callbackData = extractCallbackData(body);
    console.log("📞 Extracted data:", callbackData);
    
    // Determine payment status
    const status = callbackData.resultCode === 0 ? 'Success' : 'Failed';
    
    // Update payment in database
    const updateData: any = {
      status,
      result_code: callbackData.resultCode,
      result_desc: callbackData.resultDesc,
      updated_at: new Date().toISOString(),
    };
    
    // Add M-Pesa receipt number if payment was successful
    if (status === 'Success' && callbackData.mpesaReceiptNumber) {
      updateData.mpesa_receipt_number = callbackData.mpesaReceiptNumber;
    }
    
    // Update payment record
    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('checkout_request_id', callbackData.checkoutRequestId)
      .select();
    
    if (error) {
      console.error("❌ Database update error:", error);
      // Still acknowledge to M-Pesa to avoid retries
      return new Response(JSON.stringify({
        ResultCode: 0,
        ResultDesc: "Accepted"
      }), {
        status: 200,
        headers: CORS_HEADERS,
      });
    }
    
    console.log("✅ Payment updated successfully:", data);
    
    // Log successful callback processing
    if (status === 'Success') {
      console.log(`💰 Payment successful: ${callbackData.mpesaReceiptNumber} - KES ${callbackData.amount} from ${callbackData.phoneNumber}`);
    } else {
      console.log(`❌ Payment failed: ${callbackData.resultDesc}`);
    }
    
    // Acknowledge receipt to M-Pesa
    return new Response(JSON.stringify({
      ResultCode: 0,
      ResultDesc: "Accepted"
    }), {
      status: 200,
      headers: CORS_HEADERS,
    });
    
  } catch (error) {
    console.error("❌ Callback processing error:", error);
    
    // Still acknowledge to M-Pesa to avoid infinite retries
    return new Response(JSON.stringify({
      ResultCode: 0,
      ResultDesc: "Accepted"
    }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  }
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }
  
  return handleCallback(req);
});