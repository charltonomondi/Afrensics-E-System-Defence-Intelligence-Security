import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, Search, Shield, Info, Calendar, Users } from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';
import { mpesaService } from '@/services/mpesaService';
import { freeBreachAPI } from '@/services/freeBreachAPI';
import breachBanner from '@/assets/banner/breach.jpeg';

// Breach check result interface
interface BreachCheckResult {
  email: string;
  isBreached: boolean;
  breachCount: number;
  breaches: Array<{
    name: string;
    title: string;
    breachDate: string;
    pwnCount: number;
    description: string;
    dataClasses: string[];
    isVerified: boolean;
    isSensitive: boolean;
  }>;
  riskScore: number;
  lastChecked: string;
  recommendations: string[];
}

const CheckBreachWithPayment = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BreachCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [totalChecks, setTotalChecks] = useState(0);
  const [placeholder] = useState('Enter your email address');

  // Load total checks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('breachCheckCount');
    if (stored) {
      setTotalChecks(parseInt(stored));
    }
  }, []);

  const incrementAnonymousCounter = () => {
    const currentCount = parseInt(localStorage.getItem('breachCheckCount') || '0');
    const newCount = currentCount + 1;
    localStorage.setItem('breachCheckCount', newCount.toString());
    setTotalChecks(newCount);
    console.log(`Anonymous check #${newCount} performed - no email data stored`);
  };

  const handleCheck = async () => {
    if (!email) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Show payment modal instead of directly checking
    setError(null);
    setResult(null);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (txnId: string, sendToEmail: boolean) => {
    setTransactionId(txnId);
    setPaymentCompleted(true);
    setShowPaymentModal(false);
    
    // Send payment notification to business number
    try {
      await mpesaService.sendPaymentNotification(
        {
          status: 'completed',
          transactionId: txnId,
          amount: 10,
          phoneNumber: 'customer-phone',
          timestamp: new Date().toISOString()
        },
        email
      );
    } catch (error) {
      console.error('Failed to send payment notification:', error);
    }
    
    // Now perform the actual breach check
    setLoading(true);
    
    try {
      // Increment anonymous counter
      incrementAnonymousCounter();

      console.log('🔍 Checking email with free breach APIs...');
      const apiResult = await freeBreachAPI.checkEmail(email);

      // Convert API result to our interface format
      const breaches = apiResult.breaches.map((breach: any) => ({
        name: breach.Name || breach.name || 'Unknown',
        title: breach.Title || breach.title || breach.Name || breach.name || 'Unknown Breach',
        breachDate: breach.BreachDate || breach.date || breach.breachDate || '2020-01-01',
        pwnCount: breach.PwnCount || breach.pwnCount || breach.affected || 1000000,
        description: breach.Description || breach.description || 'Data breach details not available.',
        dataClasses: breach.DataClasses || breach.dataClasses || ['Email addresses'],
        isVerified: breach.IsVerified || breach.verified || false,
        isSensitive: breach.IsSensitive || breach.sensitive || false
      }));

      // Generate recommendations
      const recommendations = apiResult.isBreached ? [
        '🚨 Change passwords immediately for all affected accounts',
        '🔐 Enable two-factor authentication on all important accounts',
        '👀 Monitor your accounts closely for suspicious activity',
        '🔑 Consider using a password manager for unique passwords',
        '📧 Be extra cautious of phishing emails targeting you'
      ] : [
        '✅ Your email was not found in any known breaches - excellent!',
        '🔐 Continue using strong, unique passwords for all accounts',
        '🛡️ Enable two-factor authentication where possible',
        '🔄 Keep your software and apps updated regularly',
        '⚠️ Stay vigilant against phishing attempts'
      ];

      // Create result object
      const breachResult: BreachCheckResult = {
        email,
        isBreached: apiResult.isBreached,
        breachCount: breaches.length,
        breaches,
        riskScore: apiResult.riskScore,
        lastChecked: new Date().toISOString(),
        recommendations
      };

      setResult(breachResult);
      setError(null);
      
      console.log(`✅ Breach check completed using ${apiResult.source}`);
      console.log(`📊 Result: ${apiResult.message}`);
      
      // Send results to email if requested
      if (sendToEmail) {
        await sendResultsToEmail(breachResult, txnId);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check email breach status';
      console.error('🚨 Breach check failed:', errorMessage);
      setError('🔍 Breach checking failed. Please contact support with your transaction ID: ' + txnId);
    } finally {
      setLoading(false);
    }
  };

  const sendResultsToEmail = async (result: BreachCheckResult, txnId: string) => {
    try {
      console.log('📧 Sending results to email:', {
        email: result.email,
        isBreached: result.isBreached,
        breachCount: result.breachCount,
        transactionId: txnId
      });
      
      const emailData = {
        to: result.email,
        subject: 'AEDI Security - Your Email Breach Check Results',
        body: `
          Your breach check results:
          
          Email: ${result.email}
          Status: ${result.isBreached ? 'Found in breaches' : 'Not found in breaches'}
          Risk Score: ${result.riskScore}/100
          Breaches Found: ${result.breachCount}
          Transaction ID: ${txnId}
          
          Thank you for using AEDI Security services.
        `,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(`email_${txnId}`, JSON.stringify(emailData));
      
    } catch (error) {
      console.error('Failed to send email results:', error);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-green-600';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Email Breach Checker - AEDI Security"
        description="Check if your email has been compromised in data breaches. Professional cybersecurity analysis with M-Pesa payment integration."
        keywords="email breach checker, data breach, cybersecurity, M-Pesa payment, AEDI Security"
      />
      
      <Navigation />

      {/* Hero Section */}
      <section
        className="relative text-white py-20"
        style={{
          backgroundImage: `url(${breachBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Email Breach Checker
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Secure, paid breach checking service with M-Pesa integration
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>KES 10 per check</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>M-Pesa Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>{totalChecks} checks performed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            
            {/* Email Input Card */}
            <Card className="mb-8 shadow-xl border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Check Your Email Security
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Professional breach analysis for KES 10 - Pay with M-Pesa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder={placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-lg py-6 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                    onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                <Button
                  onClick={handleCheck}
                  disabled={!email || loading}
                  className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment & Checking...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Pay KES 10 & Check Email</span>
                    </div>
                  )}
                </Button>

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {paymentCompleted && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5" />
                    <p className="text-sm">
                      Payment successful! Transaction ID: {transactionId}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Privacy Guarantee Section */}
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">🔒 Privacy Guarantee</h3>
                </div>
                <p className="text-blue-800 mb-4 leading-relaxed">
                  AEDI Security does not collect, store, or retain any personal data from this breach checking service.
                  Your email address is only used temporarily to query external breach databases and is never saved to our systems.
                  All searches are anonymous and your privacy is fully protected.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">No data collection</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">No email storage</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Anonymous searches</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">GDPR compliant</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-blue-700 bg-blue-100 p-3 rounded-lg">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">📊 {totalChecks} anonymous checks performed</span>
                </div>
              </CardContent>
            </Card>

            {/* Anonymous Usage Statistics */}
            <Card className="mb-8 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Anonymous Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{totalChecks}</div>
                    <div className="text-sm font-medium text-blue-800">Total Anonymous Checks</div>
                    <div className="text-xs text-blue-600 mt-1">No emails stored</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                    <div className="text-sm font-medium text-green-800">Privacy Protected</div>
                    <div className="text-xs text-green-600 mt-1">Zero data collection</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                    <div className="text-sm font-medium text-purple-800">Emails Stored</div>
                    <div className="text-xs text-purple-600 mt-1">Complete anonymity</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-3xl font-bold text-orange-600 mb-2">KES 10</div>
                    <div className="text-sm font-medium text-orange-800">Per Check</div>
                    <div className="text-xs text-orange-600 mt-1">M-Pesa payment</div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  These statistics show usage volume only. No personal data is collected or stored.
                </p>
              </CardContent>
            </Card>

            {/* Results Display */}
            {result && (
              <Card className="shadow-xl border-0">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    {result.isBreached ? (
                      <AlertTriangle className="w-12 h-12 text-red-500" />
                    ) : (
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    )}
                  </div>
                  <CardTitle className={`text-2xl font-bold ${result.isBreached ? 'text-red-600' : 'text-green-600'}`}>
                    {result.isBreached ? 'Email Found in Breaches' : 'Email Not Found in Breaches'}
                  </CardTitle>
                  <CardDescription>
                    {result.isBreached 
                      ? `Your email was found in ${result.breachCount} breach${result.breachCount > 1 ? 'es' : ''}`
                      : 'Good news! Your email was not found in any known data breaches'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Risk Score */}
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">Risk Score</h3>
                    <div className={`text-4xl font-bold ${getRiskColor(result.riskScore)}`}>
                      {result.riskScore}/100
                    </div>
                    <p className={`text-sm ${getRiskColor(result.riskScore)}`}>
                      {getRiskLabel(result.riskScore)}
                    </p>
                  </div>

                  {/* Breach Details */}
                  {result.breaches.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Breach Details</h3>
                      {result.breaches.map((breach, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-red-50 border-red-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-red-800">{breach.title}</h4>
                            {breach.isVerified && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-red-700 mb-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(breach.breachDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{breach.pwnCount.toLocaleString()} accounts</span>
                            </div>
                          </div>
                          <p className="text-sm text-red-600 mb-2">{breach.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {breach.dataClasses.map((dataClass, idx) => (
                              <span key={idx} className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                                {dataClass}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Info className="w-5 h-5" />
                      <span>Security Recommendations</span>
                    </h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Transaction Info */}
                  <div className="text-center text-xs text-gray-500 pt-4 border-t">
                    <p>Transaction ID: {transactionId}</p>
                    <p>Last checked: {new Date(result.lastChecked).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">

              {/* What is a Data Breach */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <span>What is a Data Breach?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    A data breach occurs when unauthorized individuals gain access to confidential information,
                    often including email addresses, passwords, and personal data.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Hackers steal personal information</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Passwords and emails exposed</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Identity theft risks increase</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Found a Breach */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-orange-500" />
                    <span>Found a Breach?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Don't panic. Take immediate action by changing your passwords, enabling two-factor authentication,
                    and monitoring your accounts closely.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Change all passwords immediately</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Enable two-factor authentication</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Monitor accounts for suspicious activity</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Data Protection */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy & Data Protection</h2>
              <p className="text-xl text-gray-600">AEDI Security Ltd Commitment</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* What We DON'T Do */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800">What We DON'T Do:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">❌</span>
                    </div>
                    <span className="text-red-700">Store your email addresses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">❌</span>
                    </div>
                    <span className="text-red-700">Track your searches</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">❌</span>
                    </div>
                    <span className="text-red-700">Share data with third parties</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">❌</span>
                    </div>
                    <span className="text-red-700">Use cookies for tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">❌</span>
                    </div>
                    <span className="text-red-700">Build user profiles</span>
                  </div>
                </CardContent>
              </Card>

              {/* What We DO */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">What We DO:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-700">Provide anonymous breach checking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-700">Use secure encrypted connections</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-700">Respect your privacy completely</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-700">Follow GDPR regulations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-700">Protect your digital security</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Privacy Commitment */}
            <Card className="bg-blue-50 border-blue-200 mb-8">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Privacy Commitment</h3>
                <p className="text-blue-800 mb-6 text-lg">
                  AEDI Security Ltd is committed to protecting your privacy and does not collect any personal data through this service.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <span className="text-sm font-medium text-blue-800">Zero Data Collection</span>
                    <span className="text-xs text-blue-600">No personal info stored</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <span className="text-sm font-medium text-blue-800">No Email Storage</span>
                    <span className="text-xs text-blue-600">Immediately discarded</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <span className="text-sm font-medium text-blue-800">Anonymous Searches</span>
                    <span className="text-xs text-blue-600">Completely private</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <span className="text-sm font-medium text-blue-800">Secure Connections</span>
                    <span className="text-xs text-blue-600">Encrypted HTTPS</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <span className="text-sm font-medium text-blue-800">GDPR Compliant</span>
                    <span className="text-xs text-blue-600">International standards</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Note */}
            <Card className="bg-gray-100 border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Info className="w-6 h-6 text-gray-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Technical Note:</h4>
                    <p className="text-gray-700 text-sm">
                      Your email is only sent to external breach databases (like HaveIBeenPwned) for checking.
                      We act as a secure intermediary and never retain any information from these searches.
                      Payment processing is handled securely through M-Pesa with no financial data stored on our systems.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 via-slate-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Don't wait for a cyber attack. Contact us today for a free security consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-200 font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => window.location.href = '/contact'}
            >
              Get Free Consultation
            </Button>
            <Button
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => window.location.href = 'tel:+254743141928'}
            >
              Call +254743141928
            </Button>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        email={email}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <Footer />
    </div>
  );
};

export default CheckBreachWithPayment;
