#!/bin/bash

# AEDI Security - M-Pesa Supabase Secrets Setup
# This script sets up the required M-Pesa environment variables in Supabase Edge Functions

echo "🔧 Setting up M-Pesa secrets in Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Set M-Pesa environment variables
echo "📝 Setting M-Pesa environment variables..."

supabase secrets set MPESA_CONSUMER_KEY="9v38Dtu5u2BpsITPmLcXNWGMsjZRWSTG"
supabase secrets set MPESA_CONSUMER_SECRET="bclwIPkcRqw61yUt"
supabase secrets set MPESA_PASSKEY="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
supabase secrets set MPESA_SHORTCODE="174379"
supabase secrets set MPESA_ENV="sandbox"
supabase secrets set MPESA_CALLBACK_URL="https://ctyoktgzxqmeqzhmwpro.functions.supabase.co/mpesa-callback"

echo "✅ M-Pesa secrets configured successfully!"
echo ""
echo "🚀 Next steps:"
echo "1. Deploy your Supabase functions: supabase functions deploy"
echo "2. Test the M-Pesa integration"
echo ""
echo "📋 Test credentials being used:"
echo "   - Consumer Key: 9v38Dtu5u2BpsITPmLcXNWGMsjZRWSTG"
echo "   - Shortcode: 174379 (Safaricom test shortcode)"
echo "   - Environment: sandbox"
echo ""
echo "⚠️  IMPORTANT: Replace these with your actual sandbox credentials from:"
echo "   https://developer.safaricom.co.ke/"