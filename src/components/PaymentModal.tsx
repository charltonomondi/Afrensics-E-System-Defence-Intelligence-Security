import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Smartphone, CheckCircle, AlertCircle, CreditCard, Landmark } from 'lucide-react';
import mpesaLogo from '@/assets/gateway/M-PESA.png';
import { mpesaService } from '@/services/mpesaService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onPaymentSuccess: (transactionId: string, sendToEmail: boolean) => void;
}

type PaymentMethod = 'mpesa' | 'card' | 'bank';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'pending';

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, email, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mpesa');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [transactionId, setTransactionId] = useState('');
  const [sendToEmail, setSendToEmail] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Method-specific fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankRef, setBankRef] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('idle');
      setTransactionId('');
      setErrorMessage('');
      setCountdown(0);
      setPhoneNumber('');
      setCardName('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setBankName('');
      setAccountNumber('');
      setBankRef('');
      setSelectedMethod('mpesa');
    }
  }, [isOpen]);

  // Countdown timer for payment verification
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((s) => s - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Utilities
  const formatPhoneNumber = (phone: string) => {
    let formatted = phone.replace(/\D/g, '');
    if (formatted.startsWith('0')) formatted = '254' + formatted.substring(1);
    else if (!formatted.startsWith('254')) formatted = '254' + formatted;
    return formatted;
  };
  const validatePhoneNumber = (phone: string) => /^254[17]\d{8}$/.test(formatPhoneNumber(phone));

  const onlyDigits = (s: string) => s.replace(/\D/g, '');
  const validateCardNumber = (num: string) => {
    const digits = onlyDigits(num);
    if (digits.length < 12 || digits.length > 19) return false;
    // Luhn check
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let d = parseInt(digits[i], 10);
      if (shouldDouble) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };
  const validateExpiry = (exp: string) => {
    const m = exp.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!m) return false;
    const month = parseInt(m[1], 10);
    const year = 2000 + parseInt(m[2], 10);
    const now = new Date();
    const expDate = new Date(year, month, 0);
    return expDate >= new Date(now.getFullYear(), now.getMonth(), 1);
  };
  const validateCvv = (cvv: string) => /^\d{3,4}$/.test(cvv);

  const validateBank = () => bankName.trim().length >= 2 && /^\d{6,}$/.test(accountNumber) && bankRef.trim().length >= 4;

  const initiatePayment = async () => {
    setErrorMessage('');

    try {
      setPaymentStatus('processing');

      if (selectedMethod === 'mpesa') {
        if (!validatePhoneNumber(phoneNumber)) {
          throw new Error('Please enter a valid Kenyan phone number (07XX XXX XXX or 01XX XXX XXX)');
        }
        const formattedPhone = formatPhoneNumber(phoneNumber);
        
        // Initiate STK Push via Supabase Edge Function
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
        const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
        if (!supabaseUrl || !supabaseAnon) {
          throw new Error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
        }
        const res = await fetch(`${supabaseUrl}/functions/v1/initiate-mpesa-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnon}`,
          },
          body: JSON.stringify({
            phone: formattedPhone,
            amount: 10,
            email,
            description: 'AEDI Security - Detailed Breach Analysis',
          }),
        });
        if (!res.ok) {
          const raw = await res.text();
          let err: any = {};
          try { err = JSON.parse(raw); } catch { err = { error: raw }; }
          const serverMsg = err.error || err.message || err.details?.errorMessage || err.details?.CustomerMessage;
          throw new Error(serverMsg || 'Failed to initiate M-Pesa STK Push');
        }
        const data = await res.json();
        if (!data.success || !data.checkoutRequestId) {
          const serverMsg = data.message || data.error || data.details?.errorMessage || data.details?.CustomerMessage;
          throw new Error(serverMsg || 'Failed to initiate M-Pesa STK Push');
        }

        const txn = data.checkoutRequestId as string;
        setTransactionId(txn);
        setPaymentStatus('pending');
        setCountdown(120);
        checkPaymentStatus(txn);
        return;
      }

      if (selectedMethod === 'card') {
        if (!cardName.trim()) throw new Error('Card holder name is required');
        if (!validateCardNumber(cardNumber)) throw new Error('Invalid card number');
        if (!validateExpiry(cardExpiry)) throw new Error('Invalid expiry (MM/YY)');
        if (!validateCvv(cardCvv)) throw new Error('Invalid CVV');

        const res = await fetch('/api/initiate-card-payment', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardName, cardNumber: onlyDigits(cardNumber), cardExpiry, cardCvv, amount: 10, email })
        });
        const ok = res.ok; const data = ok ? await res.json() : {};
        const txn = data.transactionId || `CARD${Date.now()}`;
        setTransactionId(txn);
        setPaymentStatus('pending');
        setCountdown(60);
        checkPaymentStatus(txn);
        return;
      }

      if (selectedMethod === 'bank') {
        if (!validateBank()) throw new Error('Please provide bank name, account number, and reference');
        const res = await fetch('/api/initiate-bank-payment', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bankName, accountNumber, reference: bankRef, amount: 10, email })
        });
        const ok = res.ok; const data = ok ? await res.json() : {};
        const txn = data.transactionId || `BANK${Date.now()}`;
        setTransactionId(txn);
        setPaymentStatus('pending');
        setCountdown(180);
        checkPaymentStatus(txn);
        return;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to initiate payment';
      setErrorMessage(msg);
      setPaymentStatus('failed');
    }
  };

  const checkPaymentStatus = async (txnId: string) => {
    setTimeout(async () => {
      try {
        // Check payment status via backend
        const res = await fetch(`/api/check-payment-status/${encodeURIComponent(txnId)}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) {
          throw new Error('Status check failed');
        }
        const status = await res.json();

        if (status.status === 'completed') {
          setPaymentStatus('success');

          // Optional local notification/logging
          try {
            await mpesaService.sendPaymentNotification(
              {
                status: 'completed',
                transactionId: txnId,
                mpesaReceiptNumber: status.mpesaReceiptNumber,
                amount: status.amount,
                phoneNumber: status.phoneNumber,
                timestamp: new Date().toISOString()
              },
              email
            );
          } catch {}

          setTimeout(() => { onPaymentSuccess(txnId, sendToEmail); onClose(); }, 1500);
        } else if (status.status === 'failed') {
          setPaymentStatus('failed'); 
          setErrorMessage('Payment failed. Please try again.');
        } else {
          if (countdown > 0) setTimeout(() => checkPaymentStatus(txnId), 4000);
          else { setPaymentStatus('failed'); setErrorMessage('Payment timeout. Please try again.'); }
        }
      } catch (e) {
        setPaymentStatus('failed');
        setErrorMessage('Network error while checking payment status. Please try again.');
      }
    }, 2500);
  };

  const paymentMethods: Array<{
    id: PaymentMethod; name: string; icon: React.ReactNode; description: string;
  }> = [
    { id: 'mpesa', name: 'M-Pesa', icon: <img src={mpesaLogo} alt="M-Pesa" className="w-12 h-12 object-contain" />, description: 'Pay with M-Pesa STK Push' },
    { id: 'card', name: 'Credit/Debit Card', icon: <div className="w-12 h-12 bg-blue-50 rounded flex items-center justify-center"><CreditCard className="w-6 h-6 text-blue-600" /></div>, description: 'Visa, Mastercard supported' },
    { id: 'bank', name: 'Bank Transfer', icon: <div className="w-12 h-12 bg-green-50 rounded flex items-center justify-center"><Landmark className="w-6 h-6 text-green-700" /></div>, description: 'Manual bank transfer with reference' },
  ];

  const isActionDisabled = () => {
    if (selectedMethod === 'mpesa') return !phoneNumber;
    if (selectedMethod === 'card') return !cardName || !cardNumber || !cardExpiry || !cardCvv;
    if (selectedMethod === 'bank') return !bankName || !accountNumber || !bankRef;
    return true;
  };

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
            <p className="text-sm text-gray-600">Detailed analysis for:</p>
            <p className="font-medium text-gray-900">{email}</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Payment Method</Label>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod === method.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">{method.icon}</div>
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${selectedMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                    {selectedMethod === method.id && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Method-specific Inputs */}
          {selectedMethod === 'mpesa' && paymentStatus === 'idle' && (
            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input id="phone" type="tel" placeholder="0712 345 678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="text-center" />
              <p className="text-xs text-gray-500 text-center">Enter your M-Pesa registered phone number</p>
            </div>
          )}

          {selectedMethod === 'card' && paymentStatus === 'idle' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="cardName">Card Holder Name</Label>
                <Input id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4111 1111 1111 1111" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cardExpiry">Expiry (MM/YY)</Label>
                  <Input id="cardExpiry" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="12/29" />
                </div>
                <div>
                  <Label htmlFor="cardCvv">CVV</Label>
                  <Input id="cardCvv" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="123" />
                </div>
              </div>
              <p className="text-xs text-gray-500">Your card will be charged KES 10</p>
            </div>
          )}

          {selectedMethod === 'bank' && paymentStatus === 'idle' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g., KCB Bank" />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="0123456789" />
              </div>
              <div>
                <Label htmlFor="bankRef">Payment Reference</Label>
                <Input id="bankRef" value={bankRef} onChange={(e) => setBankRef(e.target.value)} placeholder="Your transfer reference" />
              </div>
              <p className="text-xs text-gray-500">We will verify your transfer using the reference provided</p>
            </div>
          )}

          {/* Email Results Option */}
          <div className="flex items-center space-x-2">
            <Checkbox id="sendEmail" checked={sendToEmail} onCheckedChange={(checked) => setSendToEmail(checked as boolean)} />
            <Label htmlFor="sendEmail" className="text-sm">Send results to my email address ({email})</Label>
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
              <p className="text-sm text-gray-600">
                {selectedMethod === 'mpesa' && 'Initiating M-Pesa payment...'}
                {selectedMethod === 'card' && 'Processing card payment...'}
                {selectedMethod === 'bank' && 'Verifying bank transfer...'}
              </p>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedMethod === 'mpesa' ? 'Check your phone' : selectedMethod === 'card' ? 'Processing...' : 'Awaiting bank confirmation'}</p>
                <p className="text-sm text-gray-600">
                  {selectedMethod === 'mpesa' && `M-Pesa STK push sent to ${phoneNumber}`}
                  {selectedMethod === 'card' && 'This may take a few seconds'}
                  {selectedMethod === 'bank' && `Ref: ${bankRef}`}
                </p>
                <p className="text-xs text-gray-500 mt-2">{countdown}s remaining</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-800"><strong>Transaction ID:</strong> {transactionId}</p>
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
                <p className="text-sm text-gray-600">Processing your detailed analysis...</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {paymentStatus === 'idle' && (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                <Button onClick={initiatePayment} disabled={isActionDisabled()} className="flex-1 bg-green-600 hover:bg-green-700">Pay KES 10</Button>
              </>
            )}

            {(paymentStatus === 'processing' || paymentStatus === 'pending') && (
              <Button variant="outline" onClick={onClose} className="w-full">Cancel Payment</Button>
            )}

            {paymentStatus === 'failed' && (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                <Button onClick={() => { setPaymentStatus('idle'); setErrorMessage(''); }} className="flex-1 bg-green-600 hover:bg-green-700">Try Again</Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;