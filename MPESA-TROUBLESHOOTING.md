# 🔧 M-Pesa Integration Troubleshooting Guide

## 🚨 Current Issue: "Failed to initiate M-Pesa STK Push"

### 🔍 **Root Cause Analysis**

The error occurs because the Supabase Edge Function is missing required M-Pesa environment variables. Here's what's happening:

1. **Frontend calls** → `https://ctyoktgzxqmeqzhmwpro.functions.supabase.co/initiate-mpesa-payment`
2. **Function checks** → Environment variables (MPESA_CONSUMER_KEY, etc.)
3. **Variables missing** → Function returns error
4. **Frontend receives** → "Failed to initiate M-Pesa STK Push"

## ✅ **Step-by-Step Fix**

### **Step 1: Set Environment Variables in Supabase**

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Login to your account
   - Select project: `ctyoktgzxqmeqzhmwpro`

2. **Navigate to Edge Functions:**
   - Click **Settings** (left sidebar)
   - Click **Edge Functions**
   - Click **Environment Variables** tab

3. **Add Required Variables:**
   ```
   MPESA_CONSUMER_KEY = your_safaricom_consumer_key
   MPESA_CONSUMER_SECRET = your_safaricom_consumer_secret
   MPESA_PASSKEY = your_safaricom_passkey
   MPESA_SHORTCODE = 174379 (for sandbox)
   MPESA_ENV = sandbox
   ```

### **Step 2: Get Safaricom Credentials**

#### **For Testing (Sandbox):**
1. Visit: https://developer.safaricom.co.ke/
2. Create account / Login
3. Create new app
4. Get Consumer Key & Consumer Secret
5. Use sandbox passkey: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`

#### **For Production:**
1. Contact Safaricom for business account
2. Get production credentials
3. Get your business shortcode
4. Get production passkey

### **Step 3: Test the Fix**

1. **Open test file:** `test-mpesa-function.html`
2. **Click "Check Environment"** - should show ✅ success
3. **Click "Test M-Pesa Function"** - should initiate STK push
4. **Test on website** - payment should work

## 🧪 **Testing Tools**

### **1. Environment Checker**
Open `test-mpesa-function.html` in your browser to:
- ✅ Check if environment variables are set
- 🧪 Test the M-Pesa function directly
- 🔍 See detailed error messages

### **2. Manual API Test**
```bash
curl -X POST https://ctyoktgzxqmeqzhmwpro.functions.supabase.co/initiate-mpesa-payment \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0eW9rdGd6eHFtZXF6aG13cHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTI1ODEsImV4cCI6MjA3MjMyODU4MX0.Zf7Ka8g5-vVTQnmRZSUWb0nK747dm2GaXJR5UJrpH1E" \
  -H "Content-Type: application/json" \
  -d '{"phone":"254712345678","amount":1,"email":"test@example.com"}'
```

### **3. Browser Console**
1. Open website
2. Press F12 → Console tab
3. Try payment
4. Check for detailed error messages

## 🔄 **Alternative Solutions**

### **Option 1: Use Backup Function**
If main function fails, deploy the backup:
```bash
# Deploy backup function with simulation mode
supabase functions deploy mpesa-backup
```

### **Option 2: Use PHP Fallback**
The `mpesa-payment-api.php` file can work as fallback:
1. Update frontend to call PHP API instead
2. Set environment variables in PHP file
3. Test with PHP server

### **Option 3: Simulation Mode**
For immediate testing without credentials:
1. The backup function includes simulation mode
2. Returns mock responses for testing
3. Allows frontend testing without real M-Pesa

## 📊 **Error Code Reference**

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Missing environment variables" | Variables not set in Supabase | Set MPESA_* variables |
| "OAuth token request failed" | Invalid credentials | Check Consumer Key/Secret |
| "STK Push initiation failed" | Invalid passkey/shortcode | Verify passkey and shortcode |
| "Invalid phone number format" | Wrong phone format | Use 254XXXXXXXXX format |
| "Function not found" | Function not deployed | Deploy function |

## 🎯 **Quick Fix Checklist**

- [ ] **Environment variables set** in Supabase Dashboard
- [ ] **Valid Safaricom credentials** (Consumer Key/Secret)
- [ ] **Correct passkey** for your environment
- [ ] **Function deployed** and accessible
- [ ] **Phone number format** correct (254XXXXXXXXX)
- [ ] **Test with small amount** (KES 1) first

## 🚀 **Immediate Action Plan**

1. **Right now:** Set environment variables in Supabase
2. **Test:** Use `test-mpesa-function.html`
3. **Verify:** Try payment on website
4. **Monitor:** Check Supabase function logs
5. **Scale:** Test with real phone numbers

## 📞 **Support Resources**

- **Supabase Docs:** https://supabase.com/docs/guides/functions
- **Safaricom API:** https://developer.safaricom.co.ke/docs
- **Test File:** `test-mpesa-function.html`
- **Setup Guide:** `setup-mpesa-secrets.md`

## 🎉 **Expected Result**

After fixing environment variables:
1. ✅ Function returns success response
2. 📱 STK push sent to customer phone
3. 💰 Payment completes successfully
4. 🔍 Breach check runs after payment
5. 📧 Results delivered to customer

Your M-Pesa integration will work perfectly once the environment variables are properly configured!
