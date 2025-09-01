import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PaymentModal from '@/components/PaymentModal';

const queryClient = new QueryClient();

const PaymentModalDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('test@example.com');

  const handlePaymentSuccess = (transactionId: string, sendToEmail: boolean) => {
    console.log('Payment successful:', { transactionId, sendToEmail });
    alert(`Payment successful! Transaction ID: ${transactionId}`);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              M-Pesa Payment Test
            </h1>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!email}
              >
                Test M-Pesa Payment (KES 10)
              </Button>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Test Instructions:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use any Kenyan phone number format (0712345678 or 254712345678)</li>
                  <li>The system will simulate an M-Pesa STK push</li>
                  <li>Payment will complete automatically after 10 seconds</li>
                  <li>Check browser console for detailed logs</li>
                </ul>
              </div>
            </div>
          </div>

          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            email={email}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default PaymentModalDemo;