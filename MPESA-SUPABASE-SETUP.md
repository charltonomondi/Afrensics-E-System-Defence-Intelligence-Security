# M-Pesa Supabase Integration Setup Guide

This guide will help you set up the complete M-Pesa payment integration with Supabase database storage and callback handling.

## 🏗️ Architecture Overview

```
Frontend (React) → Supabase Edge Functions → M-Pesa API → Callback Handler → Database
```

### Components Created:
1. **Database Schema** (`supabase/migrations/001_create_payments_table.sql`)
2. **Payment Initiation** (`supabase/functions/initiate-mpesa-payment/index.ts`)
3. **Payment Status Check** (`supabase/functions/check-payment-status/index.ts`)
4. **Callback Handler** (`supabase/functions/mpesa-callback/index.ts`)
5. **Main M-Pesa Function** (`supabase/functions/mpesa/index.ts`)

## 🚀 Setup Instructions

### Step 1: Database Setup

1. **Apply the database migration:**
   ```bash
   cd supabase
   supabase db push
   ```

2. **Verify the payments table was created:**
   - Go to your Supabase dashboard
   - Navigate to Table Editor
   - Confirm the `payments` table exists with proper columns

### Step 2: Deploy Edge Functions

1. **Deploy all functions:**
   ```bash
   supabase functions deploy initiate-mpesa-payment
   supabase functions deploy check-payment-status
   supabase functions deploy mpesa-callback
   supabase functions deploy mpesa
   ```

2. **Verify deployment:**
   - Check Supabase dashboard → Edge Functions
   - All functions should show as deployed

### Step 3: Configure Environment Variables

Set these secrets in your Supabase dashboard (Settings → Edge Functions → Secrets):

#### Required M-Pesa Credentials:
```bash
MPESA_CONSUMER_KEY=your_daraja_consumer_key
MPESA_CONSUMER_SECRET=your_daraja_consumer_secret
MPESA_PASSKEY=your_daraja_passkey
MPESA_SHORTCODE=your_business_shortcode
MPESA_ENV=sandbox  # or "production"
```

#### Required Supabase Credentials:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Optional Configuration:
```bash
MPESA_CALLBACK_URL=https://your-project.functions.supabase.co/mpesa-callback
CORS_ORIGIN=http://localhost:8080  # or your frontend URL
```

### Step 4: Update Frontend Configuration

Update your `.env` file:
```bash
# Use the main mpesa function for better integration
VITE_FUNCTIONS_URL=https://your-project.functions.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 5: Test the Integration

1. **Test payment initiation:**
   ```bash
   curl -X POST https://your-project.functions.supabase.co/initiate-mpesa-payment \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your_anon_key" \
     -d '{
       "phone": "254712345678",
       "amount": 10,
       "email": "test@example.com",
       "description": "Test payment"
     }'
   ```

2. **Test callback handler:**
   ```bash
   curl -X POST https://your-project.functions.supabase.co/mpesa-callback \
     -H "Content-Type: application/json" \
     -d '{
       "Body": {
         "stkCallback": {
           "MerchantRequestID": "test123",
           "CheckoutRequestID": "ws_CO_test123",
           "ResultCode": 0,
           "ResultDesc": "Success"
         }
       }
     }'
   ```

## 🔄 Payment Flow

### 1. Payment Initiation
- User enters phone number and clicks pay
- Frontend calls `initiate-mpesa-payment` function
- Function stores payment record in database with status "Pending"
- M-Pesa STK push is sent to user's phone
- Function returns checkout request ID

### 2. User Completes Payment
- User enters M-Pesa PIN on their phone
- M-Pesa processes the payment
- M-Pesa sends callback to `mpesa-callback` function

### 3. Callback Processing
- Callback function receives M-Pesa response
- Updates payment record in database:
  - Status: "Success" or "Failed"
  - M-Pesa receipt number (if successful)
  - Result codes and descriptions

### 4. Status Checking
- Frontend polls `check-payment-status` function
- Function queries database for payment status
- Returns current status to frontend

## 📊 Database Schema

The `payments` table includes:
- `id`: UUID primary key
- `checkout_request_id`: M-Pesa checkout request ID (unique)
- `merchant_request_id`: M-Pesa merchant request ID
- `phone_number`: Customer phone number
- `amount`: Payment amount
- `status`: Payment status (Pending, Success, Failed, Cancelled)
- `mpesa_receipt_number`: M-Pesa transaction receipt
- `email`: Customer email (optional)
- `created_at`, `updated_at`: Timestamps

## 🔍 Monitoring and Debugging

### Check Function Logs:
```bash
supabase functions logs initiate-mpesa-payment
supabase functions logs mpesa-callback
supabase functions logs check-payment-status
```

### Query Payment Records:
```sql
SELECT * FROM payments 
ORDER BY created_at DESC 
LIMIT 10;
```

### Common Issues:

1. **"Missing authorization header"**
   - Ensure VITE_SUPABASE_ANON_KEY is set in frontend
   - Check that Authorization header is included in requests

2. **"Payment not found in database"**
   - Verify payment was stored during initiation
   - Check checkout_request_id matches

3. **"Callback not received"**
   - Verify MPESA_CALLBACK_URL is correct
   - Check M-Pesa dashboard for callback status
   - Ensure callback function is deployed

## 🔐 Security Notes

- Service role key is used in Edge Functions (server-side only)
- Anon key is used in frontend (client-side)
- Row Level Security (RLS) is enabled on payments table
- All sensitive M-Pesa credentials are stored as Supabase secrets

## 📱 Frontend Integration

The PaymentModal component now includes:
- Proper authorization headers
- Fallback to local service if Supabase unavailable
- Enhanced error handling and logging
- Real-time payment status updates

## 🎯 Next Steps

1. Deploy the functions to your Supabase project
2. Set up the required environment variables
3. Test with sandbox credentials first
4. Switch to production credentials when ready
5. Monitor payments in the Supabase dashboard

## 📞 Support

If you encounter issues:
1. Check function logs in Supabase dashboard
2. Verify all environment variables are set
3. Test with M-Pesa sandbox first
4. Check database for payment records