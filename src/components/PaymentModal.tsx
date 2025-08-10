import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import mpesaLogo from '@/assets/gateway/M-PESA.png';
import airtelLogo from '@/assets/gateway/airtel.png';
import paypalLogo from '@/assets/gateway/paypal.png';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onPaymentSuccess: (transactionId: string, sendToEmail: boolean) => void;
}

type PaymentMethod = 'mpesa' | 'paypal' | 'airtel';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'pending';

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  email,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [transactionId, setTransactionId] = useState('');
  const [sendToEmail, setSendToEmail] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('idle');
      setTransactionId('');
      setErrorMessage('');
      setCountdown(0);
    }
  }, [isOpen]);

  // Countdown timer for payment verification
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatPhoneNumber = (phone: string) => {
    // Convert to Kenyan format (254...)
    let formatted = phone.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (!formatted.startsWith('254')) {
      formatted = '254' + formatted;
    }
    return formatted;
  };

  const validatePhoneNumber = (phone: string) => {
    const formatted = formatPhoneNumber(phone);
    return /^254[17]\d{8}$/.test(formatted);
  };

  const initiatePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setErrorMessage('Please enter a valid Kenyan phone number (07XX XXX XXX or 01XX XXX XXX)');
      return;
    }

    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Simulate M-Pesa STK Push
      const response = await fetch('/api/initiate-mpesa-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          amount: 10,
          email: email,
          description: 'AEDI Security - Email Breach Check'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTransactionId(data.checkoutRequestId || `AEDI${Date.now()}`);
        setPaymentStatus('pending');
        setCountdown(120); // 2 minutes to complete payment
        
        // Start checking payment status
        checkPaymentStatus(data.checkoutRequestId || `AEDI${Date.now()}`);
      } else {
        throw new Error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setPaymentStatus('failed');
      setErrorMessage('Failed to initiate payment. Please try again.');
    }
  };

  const checkPaymentStatus = async (txnId: string) => {
    // Simulate payment verification
    // In production, this would check with M-Pesa API
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/check-payment-status/${txnId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
          setPaymentStatus('success');
          setTimeout(() => {
            onPaymentSuccess(txnId, sendToEmail);
            onClose();
          }, 2000);
        } else if (data.status === 'failed') {
          setPaymentStatus('failed');
          setErrorMessage('Payment failed. Please try again.');
        } else {
          // Keep checking if still pending and countdown > 0
          if (countdown > 0) {
            setTimeout(() => checkPaymentStatus(txnId), 5000);
          } else {
            setPaymentStatus('failed');
            setErrorMessage('Payment timeout. Please try again.');
          }
        }
      } catch (error) {
        // For demo purposes, simulate successful payment after 10 seconds
        setTimeout(() => {
          setPaymentStatus('success');
          setTimeout(() => {
            onPaymentSuccess(txnId, sendToEmail);
            onClose();
          }, 2000);
        }, 10000);
      }
    }, 3000);
  };

  const paymentMethods = [
    {
      id: 'mpesa' as PaymentMethod,
      name: 'M-Pesa',
      icon: <img src={mpesaLogo} alt="M-Pesa" className="w-12 h-12 object-contain" />,
      active: true,
      description: 'Pay with M-Pesa STK Push'
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      icon: <img src={paypalLogo} alt="PayPal" className="w-12 h-12 object-contain" />,
      active: false,
      description: 'Coming Soon'
    },
    {
      id: 'airtel' as PaymentMethod,
      name: 'Airtel Money',
      icon: <img src={airtelLogo} alt="Airtel Money" className="w-12 h-12 object-contain" />,
      active: false,
      description: 'Coming Soon'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <span>Complete Payment - KES 10</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Email Display */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Checking breach status for:</p>
            <p className="font-medium text-gray-900">{email}</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Payment Method</Label>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : method.active
                    ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }`}
                onClick={() => method.active && setSelectedMethod(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                  </div>
                  {method.active && (
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedMethod === method.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Phone Number Input (M-Pesa) */}
          {selectedMethod === 'mpesa' && paymentStatus === 'idle' && (
            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712 345 678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-center"
              />
              <p className="text-xs text-gray-500 text-center">
                Enter your M-Pesa registered phone number
              </p>
            </div>
          )}

          {/* Email Results Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendEmail"
              checked={sendToEmail}
              onCheckedChange={(checked) => setSendToEmail(checked as boolean)}
            />
            <Label htmlFor="sendEmail" className="text-sm">
              Send results to my email address ({email})
            </Label>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Payment Status */}
          {paymentStatus === 'processing' && (
            <div className="text-center py-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-600">Initiating M-Pesa payment...</p>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Check your phone</p>
                <p className="text-sm text-gray-600">
                  M-Pesa STK push sent to {phoneNumber}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Complete payment on your phone ({countdown}s remaining)
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Transaction ID:</strong> {transactionId}
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">Payment Successful!</p>
                <p className="text-sm text-gray-600">
                  Processing your breach check results...
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {paymentStatus === 'idle' && (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={initiatePayment}
                  disabled={selectedMethod === 'mpesa' && !phoneNumber}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Pay KES 10
                </Button>
              </>
            )}
            
            {(paymentStatus === 'processing' || paymentStatus === 'pending') && (
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Cancel Payment
              </Button>
            )}

            {paymentStatus === 'failed' && (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setPaymentStatus('idle');
                    setErrorMessage('');
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Try Again
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
