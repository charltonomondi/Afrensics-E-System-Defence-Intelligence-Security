// Test script for M-Pesa Supabase integration
// Run with: node test-mpesa-integration.js

const SUPABASE_URL = 'https://ctyoktgzxqmeqzhmwpro.supabase.co';
const FUNCTIONS_URL = 'https://ctyoktgzxqmeqzhmwpro.functions.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0eW9rdGd6eHFtZXF6aG13cHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTI1ODEsImV4cCI6MjA3MjMyODU4MX0.Zf7Ka8g5-vVTQnmRZSUWb0nK747dm2GaXJR5UJrpH1E';

async function testPaymentInitiation() {
  console.log('🧪 Testing payment initiation...');
  
  try {
    const response = await fetch(`${FUNCTIONS_URL}/initiate-mpesa-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
      },
      body: JSON.stringify({
        phone: '254712345678',
        amount: 10,
        email: 'test@example.com',
        description: 'Test payment from integration script'
      })
    });
    
    const data = await response.json();
    console.log('✅ Payment initiation response:', data);
    
    if (data.success && data.checkoutRequestId) {
      console.log('🎯 Payment initiated successfully!');
      return data.checkoutRequestId;
    } else {
      console.log('❌ Payment initiation failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Payment initiation error:', error.message);
    return null;
  }
}

async function testPaymentStatus(checkoutRequestId) {
  console.log('🧪 Testing payment status check...');
  
  try {
    const response = await fetch(`${FUNCTIONS_URL}/check-payment-status/${encodeURIComponent(checkoutRequestId)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
      }
    });
    
    const data = await response.json();
    console.log('✅ Payment status response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Payment status check error:', error.message);
    return null;
  }
}

async function testCallbackHandler() {
  console.log('🧪 Testing callback handler...');
  
  const mockCallback = {
    Body: {
      stkCallback: {
        MerchantRequestID: 'test_merchant_123',
        CheckoutRequestID: 'ws_CO_test_123',
        ResultCode: 0,
        ResultDesc: 'The service request is processed successfully.',
        CallbackMetadata: {
          Item: [
            { Name: 'Amount', Value: 10 },
            { Name: 'MpesaReceiptNumber', Value: 'NLJ7RT61SV' },
            { Name: 'TransactionDate', Value: 20230101120000 },
            { Name: 'PhoneNumber', Value: 254712345678 }
          ]
        }
      }
    }
  };
  
  try {
    const response = await fetch(`${FUNCTIONS_URL}/mpesa-callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockCallback)
    });
    
    const data = await response.json();
    console.log('✅ Callback handler response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Callback handler error:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting M-Pesa integration tests...\n');
  
  // Test 1: Payment initiation
  const checkoutRequestId = await testPaymentInitiation();
  console.log('');
  
  // Test 2: Payment status (if initiation succeeded)
  if (checkoutRequestId) {
    await testPaymentStatus(checkoutRequestId);
    console.log('');
  }
  
  // Test 3: Callback handler
  await testCallbackHandler();
  console.log('');
  
  console.log('🏁 Tests completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Check your Supabase dashboard for payment records');
  console.log('2. Verify Edge Functions are deployed and working');
  console.log('3. Set up your M-Pesa credentials in Supabase secrets');
  console.log('4. Test with real M-Pesa sandbox credentials');
}

// Run the tests
runTests().catch(console.error);