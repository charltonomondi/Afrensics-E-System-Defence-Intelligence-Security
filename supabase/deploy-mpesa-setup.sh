#!/bin/bash

# AEDI Security - M-Pesa Supabase Setup Script
# This script sets up the complete M-Pesa integration with Supabase

echo "🚀 Setting up M-Pesa integration with Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory. Run 'supabase init' first."
    exit 1
fi

echo "📊 Creating database schema..."
# Apply database migrations
supabase db push

echo "🔧 Deploying Edge Functions..."
# Deploy all M-Pesa related functions
supabase functions deploy initiate-mpesa-payment
supabase functions deploy check-payment-status  
supabase functions deploy mpesa-callback
supabase functions deploy mpesa

echo "🔐 Setting up function secrets..."
echo "Please set the following secrets in your Supabase dashboard or via CLI:"
echo ""
echo "Required M-Pesa Secrets:"
echo "  MPESA_CONSUMER_KEY=your_consumer_key"
echo "  MPESA_CONSUMER_SECRET=your_consumer_secret"
echo "  MPESA_PASSKEY=your_passkey"
echo "  MPESA_SHORTCODE=your_shortcode"
echo "  MPESA_ENV=sandbox  # or production"
echo ""
echo "Required Supabase Secrets:"
echo "  SUPABASE_URL=your_supabase_url"
echo "  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
echo ""
echo "Optional:"
echo "  MPESA_CALLBACK_URL=https://your-project.functions.supabase.co/mpesa-callback"
echo ""
echo "To set secrets via CLI:"
echo "  supabase secrets set MPESA_CONSUMER_KEY=your_key MPESA_CONSUMER_SECRET=your_secret ..."

echo ""
echo "📋 Next steps:"
echo "1. Set the required secrets in Supabase dashboard"
echo "2. Update your frontend .env file with the function URLs"
echo "3. Test the payment flow"
echo ""
echo "✅ M-Pesa setup complete!"