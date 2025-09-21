-- Create payments table for M-Pesa transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Payment identifiers
  checkout_request_id TEXT UNIQUE,
  merchant_request_id TEXT,
  mpesa_receipt_number TEXT,
  
  -- Payment details
  phone_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  account_reference TEXT DEFAULT 'Afrensics',
  description TEXT DEFAULT 'Payment',
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Success', 'Failed', 'Cancelled')),
  result_code INTEGER,
  result_desc TEXT,
  
  -- Environment and metadata
  env TEXT DEFAULT 'sandbox' CHECK (env IN ('sandbox', 'production')),
  email TEXT,
  
  -- Indexes for faster queries
  CONSTRAINT payments_checkout_request_id_key UNIQUE (checkout_request_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_checkout_request_id ON payments(checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_payments_phone_number ON payments(phone_number);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access
CREATE POLICY "Service role can manage payments" ON payments
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users to view their own payments
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.role() = 'authenticated');