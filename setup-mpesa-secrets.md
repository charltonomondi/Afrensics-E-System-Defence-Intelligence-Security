# M-Pesa Environment Variables Setup Guide

## 🔧 Required Environment Variables

You need to set these environment variables in your Supabase project for the M-Pesa integration to work:

### 1. **MPESA_CONSUMER_KEY**
- Your Safaricom Consumer Key from the Daraja API portal
- Example: `your_consumer_key_here`

### 2. **MPESA_CONSUMER_SECRET**
- Your Safaricom Consumer Secret from the Daraja API portal
- Example: `your_consumer_secret_here`

### 3. **MPESA_PASSKEY**
- Your STK Push Passkey from Safaricom
- Example: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`

### 4. **MPESA_SHORTCODE**
- Your business shortcode (use 174379 for sandbox testing)
- Example: `174379`

### 5. **MPESA_ENV** (Optional)
- Set to "sandbox" for testing or "production" for live
- Default: `sandbox`

### 6. **MPESA_CALLBACK_URL** (Optional)
- URL for M-Pesa callbacks
- Default: `https://ctyoktgzxqmeqzhmwpro.functions.supabase.co/mpesa-callback`

## 🚀 How to Set Environment Variables in Supabase

### Method 1: Using Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `ctyoktgzxqmeqzhmwpro`
3. Navigate to **Settings** → **Edge Functions**
4. Click on **Environment Variables**
5. Add each variable:
   - Name: `MPESA_CONSUMER_KEY`
   - Value: `your_actual_consumer_key`
   - Click **Add**
6. Repeat for all variables above

### Method 2: Using Supabase CLI (if installed)
```bash
# Set environment variables
supabase secrets set MPESA_CONSUMER_KEY=your_actual_consumer_key
supabase secrets set MPESA_CONSUMER_SECRET=your_actual_consumer_secret
supabase secrets set MPESA_PASSKEY=your_actual_passkey
supabase secrets set MPESA_SHORTCODE=174379
supabase secrets set MPESA_ENV=sandbox

# Deploy the function
supabase functions deploy initiate-mpesa-payment
```

## 🧪 Testing Configuration

### Test with Sandbox Credentials
For testing, you can use these Safaricom sandbox credentials:

```
MPESA_CONSUMER_KEY=your_sandbox_consumer_key
MPESA_CONSUMER_SECRET=your_sandbox_consumer_secret
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_SHORTCODE=174379
MPESA_ENV=sandbox
```

### Test the Function
After setting the environment variables, test the function:

```bash
curl -X POST https://ctyoktgzxqmeqzhmwpro.functions.supabase.co/initiate-mpesa-payment \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "254712345678",
    "amount": 10,
    "email": "test@example.com",
    "description": "Test payment"
  }'
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Missing environment variables"**
   - Ensure all required variables are set in Supabase
   - Redeploy the function after setting variables

2. **"OAuth token request failed"**
   - Check your CONSUMER_KEY and CONSUMER_SECRET
   - Ensure they're valid Safaricom credentials

3. **"STK Push initiation failed"**
   - Verify your PASSKEY is correct
   - Check the phone number format (254XXXXXXXXX)

4. **"Function not found"**
   - Deploy the function: `supabase functions deploy initiate-mpesa-payment`
   - Check the function URL is correct

## 📱 Getting Safaricom Credentials

### For Sandbox (Testing):
1. Visit: https://developer.safaricom.co.ke/
2. Create an account
3. Create a new app
4. Get your Consumer Key and Consumer Secret
5. Use the sandbox passkey: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`

### For Production:
1. Contact Safaricom to get production credentials
2. Get your business shortcode
3. Get your production passkey
4. Set MPESA_ENV=production

## ✅ Verification Steps

1. **Check Environment Variables**: Ensure all are set in Supabase
2. **Test Function**: Use curl or Postman to test the endpoint
3. **Check Logs**: View function logs in Supabase dashboard
4. **Test Payment**: Try a small amount (KES 1) first
5. **Monitor**: Check for successful STK push on test phone

## 🎯 Next Steps

After setting up the environment variables:
1. Test the function with the curl command above
2. Try a payment through your website
3. Check the browser console for any errors
4. Monitor the Supabase function logs
5. Verify STK push is received on the test phone

Your M-Pesa integration should work once these environment variables are properly configured!
