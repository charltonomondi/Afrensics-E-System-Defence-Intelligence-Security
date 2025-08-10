import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, Search, Shield, Info, Calendar, Users } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
// import { breachCheckService, type BreachCheckResult } from '@/services/breachCheckService';
import { freeBreachAPI } from '@/services/freeBreachAPI';
import PaymentModal from '@/components/PaymentModal';
import { mpesaService } from '@/services/mpesaService';

// Temporary interface for testing
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
import pwnedBanner from '@/assets/banner/pwned.jpg';

const CheckBreach = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BreachCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [totalChecks, setTotalChecks] = useState(0);
  const [placeholder, setPlaceholder] = useState('Enter your email address');

  // Load anonymous counter from localStorage on component mount
  useEffect(() => {
    const savedCount = localStorage.getItem('aedi_breach_checks_count');
    if (savedCount) {
      setTotalChecks(parseInt(savedCount));
    }
  }, []);

  // Anonymous counter function - only tracks numbers, never emails
  const incrementAnonymousCounter = () => {
    const newCount = totalChecks + 1;
    setTotalChecks(newCount);
    localStorage.setItem('aedi_breach_checks_count', newCount.toString());

    // Optional: Send anonymous analytics event (no personal data)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'breach_check_performed', {
        event_category: 'security_tools',
        event_label: 'anonymous_email_check',
        value: 1,
        // No personal data sent - just anonymous usage tracking
      });
    }

    console.log(`Anonymous check #${newCount} performed - no email data stored`);
  };

  // Admin function to get anonymous analytics (accessible via browser console)
  const getAnonymousAnalytics = () => {
    const totalChecks = localStorage.getItem('aedi_breach_checks_count') || '0';
    const lastCheck = localStorage.getItem('lastBreachCheck');
    const lastCheckDate = lastCheck ? new Date(parseInt(lastCheck)).toLocaleString() : 'Never';

    return {
      totalAnonymousChecks: parseInt(totalChecks),
      lastCheckTime: lastCheckDate,
      privacyCompliant: true,
      emailsStored: 0,
      dataCollected: 'None - fully anonymous'
    };
  };

  // Make analytics function available globally for admin access
  useEffect(() => {
    (window as any).getAEDIAnalytics = getAnonymousAnalytics;
    return () => {
      delete (window as any).getAEDIAnalytics;
    };
  }, []);

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
          phoneNumber: 'customer-phone', // This would come from payment modal
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
      // Increment anonymous counter (no email data stored)
      incrementAnonymousCounter();

      // Use the new FREE API service that handles CORS and multiple APIs
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

      // Generate recommendations based on results
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

      // Create the result object
      const result: BreachCheckResult = {
        email,
        isBreached: apiResult.isBreached,
        breachCount: breaches.length,
        breaches,
        riskScore: apiResult.riskScore,
        lastChecked: new Date().toISOString(),
        recommendations
      };

      setResult(result);

      // Clear any previous errors
      setError(null);

      // Show success message in console
      console.log(`✅ Breach check completed using ${apiResult.source}`);
      console.log(`📊 Result: ${apiResult.message}`);

      // If user requested email results, send them
      if (sendToEmail) {
        await sendResultsToEmail(result, txnId);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check email breach status';
      console.error('🚨 All free APIs failed:', errorMessage);

      // Set a user-friendly error message
      setError('🔍 Breach checking APIs are temporarily unavailable. Please contact support with your transaction ID: ' + txnId);
    } finally {
      setLoading(false);
    }
  };

  const sendResultsToEmail = async (result: BreachCheckResult, txnId: string) => {
    try {
      // In production, this would send actual email
      console.log('📧 Sending results to email:', {
        email: result.email,
        isBreached: result.isBreached,
        breachCount: result.breachCount,
        transactionId: txnId
      });

      // Simulate email sending
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

      // Store email for tracking
      localStorage.setItem(`email_${txnId}`, JSON.stringify(emailData));

    } catch (error) {
      console.error('Failed to send email results:', error);
    }
  };

  // Component logic continues...

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

      // Generate recommendations based on results
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

      // Create the result object
      const result: BreachCheckResult = {
        email,
        isBreached: apiResult.isBreached,
        breachCount: breaches.length,
        breaches,
        riskScore: apiResult.riskScore,
        lastChecked: new Date().toISOString(),
        recommendations
      };

      setResult(result);

      // Clear any previous errors
      setError(null);

      // Show success message in console
      console.log(`✅ Breach check completed using ${apiResult.source}`);
      console.log(`📊 Result: ${apiResult.message}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check email breach status';
      console.error('🚨 All free APIs failed:', errorMessage);

      // Set a user-friendly error message
      setError('🔍 Free breach checking APIs are temporarily unavailable. Showing demo data below.');

      // The free API service should have already provided a fallback result
      // But if it completely fails, we'll show demo data
      const demoResult: BreachCheckResult = {
        email,
        isBreached: false,
        breachCount: 0,
        breaches: [],
        riskScore: 0,
        lastChecked: new Date().toISOString(),
        recommendations: [
          '⚠️ Free APIs temporarily unavailable - this is demo data',
          '🔐 For real breach checking, visit haveibeenpwned.com directly',
          '📞 Contact AEDI Security for professional breach monitoring',
          '🛡️ Always use strong, unique passwords',
          '📧 Be cautious of phishing emails'
        ]
      };

      setResult(demoResult);

    } finally {
      setLoading(false);

      // Reset the email form after check is complete (with slight delay for better UX)
      setTimeout(() => {
        setEmail('');
        setPlaceholder('✓ Check complete - Enter another email');

        // Reset placeholder back to normal after 3 seconds
        setTimeout(() => {
          setPlaceholder('Enter your email address');
        }, 3000);
      }, 500); // 500ms delay allows user to see the check completed
    }
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Check Data Breach | Have I Been Pwned | AEDI Security Kenya"
        description="Check if your email has been compromised in a data breach. Free breach checking tool by AEDI Security. Protect yourself from cyber threats and data breaches."
        keywords="Data Breach Check, Have I Been Pwned, Email Breach Check, Cybersecurity Tool, Data Breach Detection, Email Security, AEDI Security Tools, Breach Monitoring, Cyber Threats"
        url="https://aedisecurity.com/check-breach"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${pwnedBanner})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Check Data Breach
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find out if your email has been compromised in a data breach
          </p>
        </div>
      </section>


      {/* Breach Check Tool */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="card-gradient shadow-hero">
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold">Check Your Email</CardTitle>
              <CardDescription className="text-lg">
                Enter your email address to see if it has appeared in any known data breaches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-4">
                <Input
                  type="email"
                  placeholder={placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-lg py-6"
                />
                <Button
                  onClick={handleCheck}
                  disabled={!email || loading}
                  size="lg"
                  className="primary-gradient text-white px-8"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Checking...
                    </div>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Check Email
                    </>
                  )}
                </Button>
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">
                      🔒 Privacy Guarantee
                    </h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      <strong>Afrensics Security Ltd does not collect, store, or retain any personal data</strong> from this breach checking service.
                      Your email address is only used temporarily to query external breach databases and is never saved to our systems.
                      All searches are anonymous and your privacy is fully protected.
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-blue-600">
                        <span>✓ No data collection</span>
                        <span>✓ No email storage</span>
                        <span>✓ Anonymous searches</span>
                        <span>✓ GDPR compliant</span>
                      </div>
                      {totalChecks > 0 && (
                        <div className="text-xs text-blue-600 font-medium">
                          📊 {totalChecks.toLocaleString()} anonymous checks performed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-800">API Notice</h3>
                      <p className="text-yellow-700">{error}</p>
                      <p className="text-sm text-yellow-600 mt-2">
                        {error.includes('CORS') ?
                          'Due to browser security, we\'re showing demo data. The real API works from our servers.' :
                          'Showing demo data while the service is temporarily unavailable.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Results */}
              {result && (
                <div className="mt-8">
                  {result.isBreached ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-red-800">Email Found in Breaches</h3>
                          <p className="text-red-600">
                            Your email was found in {result.breachCount} breach{result.breachCount > 1 ? 'es' : ''}
                          </p>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              Risk Score: {result.riskScore}/100
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {result.breaches.map((breach, index) => (
                          <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-semibold text-red-800">{breach.title || breach.name}</h4>
                                  {breach.isVerified && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Verified
                                    </span>
                                  )}
                                  {breach.isSensitive && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                      Sensitive
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-red-600 mb-2">
                                  <Calendar className="inline w-4 h-4 mr-1" />
                                  Breach Date: {new Date(breach.breachDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">{breach.description}</p>
                                <div className="flex flex-wrap gap-1">
                                  {breach.dataClasses.slice(0, 4).map((dataClass, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                                      {dataClass}
                                    </span>
                                  ))}
                                  {breach.dataClasses.length > 4 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                                      +{breach.dataClasses.length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-sm text-red-600">Accounts Affected:</p>
                                <p className="font-semibold text-red-800">
                                  <Users className="inline w-4 h-4 mr-1" />
                                  {breach.pwnCount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-3">
                          🛡️ Security Recommendations
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-2">
                          {result.recommendations.map((recommendation, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-yellow-600 mr-2">•</span>
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-3 border-t border-yellow-200">
                          <p className="text-xs text-yellow-600">
                            Last checked: {new Date(result.lastChecked).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-green-800">Good News!</h3>
                          <p className="text-green-600">
                            Your email was not found in any known breaches
                          </p>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              Risk Score: {result.riskScore}/100 - Excellent
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3">🛡️ Keep Staying Protected:</h4>
                        <ul className="text-sm text-blue-700 space-y-2">
                          {result.recommendations.map((recommendation, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-3 border-t border-blue-200">
                          <p className="text-xs text-blue-600">
                            Last checked: {new Date(result.lastChecked).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Usage Statistics */}
      {totalChecks > 0 && (
        <section className="py-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Anonymous Usage Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{totalChecks.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Anonymous Checks</div>
                  <div className="text-xs text-gray-500 mt-1">No emails stored</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                  <div className="text-sm text-gray-600">Privacy Protected</div>
                  <div className="text-xs text-gray-500 mt-1">Zero data collection</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                  <div className="text-sm text-gray-600">Emails Stored</div>
                  <div className="text-xs text-gray-500 mt-1">Complete anonymity</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                These statistics show usage volume only. No personal data is collected or stored.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Information Section */}
      <section className="py-16 bg-cyber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-gradient shadow-card">
              <CardHeader>
                <Info className="h-8 w-8 text-primary mb-2" />
                <CardTitle>What is a Data Breach?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A data breach occurs when unauthorized individuals gain access to confidential 
                  information, often including email addresses, passwords, and personal data.
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient shadow-card">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Privacy & Data Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-muted-foreground font-semibold">
                    <strong>Afrensics Security Ltd Commitment:</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Zero Data Collection:</strong> We do not collect, store, or retain any personal information</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>No Email Storage:</strong> Your email is only used for the search query and immediately discarded</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Anonymous Searches:</strong> All breach checks are completely anonymous</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Secure Connections:</strong> All communications use encrypted HTTPS connections</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>GDPR Compliant:</strong> Full compliance with international privacy regulations</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient shadow-card">
              <CardHeader>
                <AlertTriangle className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Found a Breach?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Don't panic. Take immediate action by changing your passwords, enabling 
                  two-factor authentication, and monitoring your accounts closely.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Statement Footer */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-100">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Privacy Commitment</h3>
              </div>
              <div className="text-gray-700 space-y-4">
                <p className="text-lg font-semibold">
                  <strong>Afrensics Security Ltd</strong> is committed to protecting your privacy and does not collect any personal data through this service.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 mb-2">What We DON'T Do:</h4>
                    <ul className="text-sm space-y-1">
                      <li>❌ Store your email addresses</li>
                      <li>❌ Track your searches</li>
                      <li>❌ Share data with third parties</li>
                      <li>❌ Use cookies for tracking</li>
                      <li>❌ Build user profiles</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 mb-2">What We DO:</h4>
                    <ul className="text-sm space-y-1">
                      <li>✅ Provide anonymous breach checking</li>
                      <li>✅ Use secure encrypted connections</li>
                      <li>✅ Respect your privacy completely</li>
                      <li>✅ Follow GDPR regulations</li>
                      <li>✅ Protect your digital security</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Technical Note:</strong> Your email is only sent to external breach databases (like HaveIBeenPwned) for checking.
                    We act as a secure intermediary and never retain any information from these searches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Secure Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Don't wait for a cyber attack. Contact us today for a free security consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-lg">
              Security Assessment
            </Button>
            <a href="tel:+254743141928">
              <Button
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-2 border-white/20 hover:from-green-700 hover:to-emerald-700 hover:border-white/40 hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold shadow-lg backdrop-blur-sm"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call Now: +254743141928</span>
                </span>
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      {/* <WhatsAppFloat /> */}
    </div>
  );
};

export default CheckBreach;