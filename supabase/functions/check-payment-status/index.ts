// supabase/functions/check-payment-status/index.ts
// Edge Function to check M-Pesa payment status

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

// Simple in-memory storage for demo (in production, use Supabase database)
const paymentStore = new Map<string, any>();

// Helper function to simulate payment completion
function simulatePaymentCompletion(checkoutRequestId: string, timestamp: number): any {
  const currentTime = Date.now();
  const elapsedTime = currentTime - timestamp;

  // Simulate payment processing time
  if (elapsedTime < 10000) {
    // Still processing (first 10 seconds)
    return { status: 'pending' };
  } else if (elapsedTime < 120000) {
    // Simulate 90% success rate (10 seconds to 2 minutes)
    const isSuccessful = Math.random() > 0.1;
    
    if (isSuccessful) {
      const mpesaReceiptNumber = `NLJ7RT61SV${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      
      // Store completion data
      const completionData = {
        status: 'completed',
        transactionId: checkoutRequestId,
        mpesaReceiptNumber,
        amount: 10,
        phoneNumber: '254712345678', // This would come from the original request
        timestamp: new Date().toISOString(),
        completedAt: currentTime
      };
      
      paymentStore.set(checkoutRequestId, completionData);
      
      return completionData;
    } else {
      return { status: 'failed' };
    }
  } else {
    // Timeout after 2 minutes
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

    // Check if we have stored data for this payment
    let storedPayment = paymentStore.get(checkoutRequestId);
    
    if (!storedPayment) {
      // If no stored data, create initial entry with current timestamp
      // In a real implementation, this would come from when the STK push was initiated
      storedPayment = {
        checkoutRequestId,
        timestamp: Date.now() - 5000, // Assume payment was initiated 5 seconds ago
        status: 'pending'
      };
      paymentStore.set(checkoutRequestId, storedPayment);
    }

    // If payment is already completed, return the stored result
    if (storedPayment.status === 'completed') {
      return new Response(JSON.stringify(storedPayment), {
        headers: CORS_HEADERS,
      });
    }

    // Simulate payment processing
    const result = simulatePaymentCompletion(checkoutRequestId, storedPayment.timestamp);
    
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
