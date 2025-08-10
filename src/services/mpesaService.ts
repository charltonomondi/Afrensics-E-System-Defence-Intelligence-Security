// M-Pesa Payment Service
// This handles M-Pesa STK Push and payment verification

interface MpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
  email: string;
  description: string;
}

interface MpesaPaymentResponse {
  success: boolean;
  checkoutRequestId?: string;
  message: string;
  transactionId?: string;
}

interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  mpesaReceiptNumber?: string;
  amount?: number;
  phoneNumber?: string;
  timestamp?: string;
}

class MpesaService {
  private readonly businessShortCode = '174379'; // Safaricom test shortcode
  private readonly passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Test passkey
  private readonly callbackUrl = `${window.location.origin}/api/mpesa/callback`;
  private readonly accountReference = 'AEDI-SECURITY';
  private readonly transactionDesc = 'Email Breach Check';

  // Simulate M-Pesa STK Push (in production, this would be server-side)
  async initiateSTKPush(request: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    try {
      // Generate unique checkout request ID
      const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In production, this would make actual API call to Safaricom
      // For demo, we'll simulate the process
      
      console.log('🏦 Initiating M-Pesa STK Push:', {
        phoneNumber: request.phoneNumber,
        amount: request.amount,
        checkoutRequestId,
        businessShortCode: this.businessShortCode
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store payment request for verification
      this.storePaymentRequest(checkoutRequestId, request);

      return {
        success: true,
        checkoutRequestId,
        message: 'STK Push sent successfully',
        transactionId: checkoutRequestId
      };

    } catch (error) {
      console.error('M-Pesa STK Push failed:', error);
      return {
        success: false,
        message: 'Failed to initiate payment. Please try again.'
      };
    }
  }

  // Check payment status
  async checkPaymentStatus(checkoutRequestId: string): Promise<PaymentStatus> {
    try {
      // In production, this would query Safaricom's API
      // For demo, we'll simulate payment completion after some time
      
      const storedRequest = this.getStoredPaymentRequest(checkoutRequestId);
      if (!storedRequest) {
        return { status: 'failed' };
      }

      // Simulate payment processing time (10-30 seconds)
      const requestTime = storedRequest.timestamp;
      const currentTime = Date.now();
      const elapsedTime = currentTime - requestTime;

      if (elapsedTime < 10000) {
        // Still processing
        return { status: 'pending' };
      } else if (elapsedTime < 120000) {
        // Simulate 90% success rate
        const isSuccessful = Math.random() > 0.1;
        
        if (isSuccessful) {
          const mpesaReceiptNumber = `NLJ7RT61SV_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
          
          // Mark as completed
          this.markPaymentCompleted(checkoutRequestId, mpesaReceiptNumber);
          
          return {
            status: 'completed',
            transactionId: checkoutRequestId,
            mpesaReceiptNumber,
            amount: storedRequest.amount,
            phoneNumber: storedRequest.phoneNumber,
            timestamp: new Date().toISOString()
          };
        } else {
          return { status: 'failed' };
        }
      } else {
        // Timeout
        return { status: 'failed' };
      }

    } catch (error) {
      console.error('Payment status check failed:', error);
      return { status: 'failed' };
    }
  }

  // Send payment confirmation to business number
  async sendPaymentNotification(paymentDetails: PaymentStatus, email: string): Promise<void> {
    try {
      // In production, this would send SMS or email notification
      console.log('📱 Sending payment notification to 0743141928:', {
        amount: paymentDetails.amount,
        mpesaCode: paymentDetails.mpesaReceiptNumber,
        email: email,
        phone: paymentDetails.phoneNumber
      });

      // Simulate sending notification
      const notificationData = {
        to: '254743141928',
        message: `AEDI Security Payment Received\nAmount: KES ${paymentDetails.amount}\nM-Pesa Code: ${paymentDetails.mpesaReceiptNumber}\nEmail: ${email}\nPhone: ${paymentDetails.phoneNumber}`,
        timestamp: new Date().toISOString()
      };

      // Store notification for tracking
      localStorage.setItem(`notification_${paymentDetails.transactionId}`, JSON.stringify(notificationData));
      
    } catch (error) {
      console.error('Failed to send payment notification:', error);
    }
  }

  // Verify payment with M-Pesa (production method)
  async verifyPayment(mpesaReceiptNumber: string): Promise<boolean> {
    try {
      // In production, this would verify with Safaricom API
      // For demo, we'll check our local storage
      
      const payments = this.getCompletedPayments();
      return payments.some(payment => payment.mpesaReceiptNumber === mpesaReceiptNumber);
      
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  // Helper methods for demo (in production, these would be database operations)
  private storePaymentRequest(checkoutRequestId: string, request: MpesaPaymentRequest): void {
    const paymentData = {
      ...request,
      checkoutRequestId,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    localStorage.setItem(`payment_${checkoutRequestId}`, JSON.stringify(paymentData));
  }

  private getStoredPaymentRequest(checkoutRequestId: string): any {
    const stored = localStorage.getItem(`payment_${checkoutRequestId}`);
    return stored ? JSON.parse(stored) : null;
  }

  private markPaymentCompleted(checkoutRequestId: string, mpesaReceiptNumber: string): void {
    const stored = this.getStoredPaymentRequest(checkoutRequestId);
    if (stored) {
      stored.status = 'completed';
      stored.mpesaReceiptNumber = mpesaReceiptNumber;
      stored.completedAt = Date.now();
      localStorage.setItem(`payment_${checkoutRequestId}`, JSON.stringify(stored));
    }
  }

  private getCompletedPayments(): any[] {
    const payments = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('payment_')) {
        const payment = JSON.parse(localStorage.getItem(key) || '{}');
        if (payment.status === 'completed') {
          payments.push(payment);
        }
      }
    }
    return payments;
  }

  // Get payment history for admin
  getPaymentHistory(): any[] {
    return this.getCompletedPayments().map(payment => ({
      transactionId: payment.checkoutRequestId,
      mpesaCode: payment.mpesaReceiptNumber,
      amount: payment.amount,
      phoneNumber: payment.phoneNumber,
      email: payment.email,
      timestamp: new Date(payment.completedAt).toLocaleString(),
      description: payment.description
    }));
  }

  // Format phone number for M-Pesa
  formatPhoneNumber(phone: string): string {
    let formatted = phone.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (!formatted.startsWith('254')) {
      formatted = '254' + formatted;
    }
    return formatted;
  }

  // Validate Kenyan phone number
  isValidKenyanPhone(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone);
    return /^254[17]\d{8}$/.test(formatted);
  }
}

// Export singleton instance
export const mpesaService = new MpesaService();
export default mpesaService;
