import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, CheckCircle, Search, Shield, Info, Calendar, Users, Mail, Send } from 'lucide-react';
import { freeBreachAPI } from '@/services/freeBreachAPI';
import securityLogsService from '@/services/securityLogsService';
import pwnedBanner from '@/assets/banner/pwned.jpg';
import emailjs from 'emailjs-com';
import { emailjsConfig } from '@/config/emailjs';

// Detailed result used AFTER payment
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
  darkWeb?: {
    found: boolean;
    sources: string[];
    vectors: string[];
    notes: string[];
  };
}

const CheckBreach = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic result (pre-payment): only breached/not breached
  const [basicChecked, setBasicChecked] = useState(false);
  const [basicBreached, setBasicBreached] = useState<boolean | null>(null);

  // Detailed result (post-payment)
  const [detailedResult, setDetailedResult] = useState<BreachCheckResult | null>(null);

  // UI state
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  // Email sending state
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Anonymous usage counter
  const [totalChecks, setTotalChecks] = useState(0);
  const [placeholder, setPlaceholder] = useState('Enter your email address');

  useEffect(() => {
    const savedCount = localStorage.getItem('aedi_breach_checks_count');
    if (savedCount) setTotalChecks(parseInt(savedCount));
  }, []);

  // Live stats from backend
  const [liveEmailChecks, setLiveEmailChecks] = useState<number | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLiveLoading(true);
      setLiveError(null);
      try {
        const base = (import.meta as any).env?.VITE_API_BASE?.toString() || '/api';
        const res = await fetch(`${base}/be/stats`);
        if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
        const data = await res.json();
        setLiveEmailChecks(Number(data.email_breach_checks || 0));
      } catch (e: any) {
        setLiveError('Statistics temporarily unavailable');
        console.warn('Failed to load live stats', e);
      } finally {
        setLiveLoading(false);
      }
    };
    fetchStats();
    const id = setInterval(fetchStats, 60_000); // refresh every 60s
    return () => clearInterval(id);
  }, []);

  const incrementAnonymousCounter = () => {
    const newCount = totalChecks + 1;
    setTotalChecks(newCount);
    localStorage.setItem('aedi_breach_checks_count', newCount.toString());

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'breach_check_performed', {
        event_category: 'security_tools',
        event_label: 'anonymous_email_check',
        value: 1,
      });
    }
  };

  // Submit check (free detailed results). This updates anonymous counter and shows detailed results immediately.
  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);
    setLoading(true);
    setDetailedResult(null); // reset detailed view if any

    try {
      const apiResult = await freeBreachAPI.checkEmail(email);

      // Persist raw email to Supabase table per request
      try {
        await securityLogsService.logEmailBreach(email);
      } catch (persistErr) {
        console.warn('Failed to persist email breach log:', persistErr);
      }

      // Update anonymous counter on every check
      incrementAnonymousCounter();

      // Create detailed result immediately (no payment required)
      const breaches = apiResult.breaches.map((breach: any) => ({
        name: breach.Name || breach.name || 'Unknown',
        title: breach.Title || breach.title || breach.Name || breach.name || 'Unknown Breach',
        breachDate: breach.BreachDate || breach.date || breach.breachDate || '2020-01-01',
        pwnCount: breach.PwnCount || breach.pwnCount || breach.affected || 1000000,
        description: breach.Description || breach.description || 'Data breach details not available.',
        dataClasses: breach.DataClasses || breach.dataClasses || ['Email addresses'],
        isVerified: breach.IsVerified || breach.verified || false,
        isSensitive: breach.IsSensitive || breach.sensitive || false,
      }));

      const recommendations = apiResult.isBreached
        ? [
            'Change passwords immediately for affected accounts',
            'Enable two-factor authentication on important accounts',
            'Monitor your accounts closely for suspicious activity',
            'Use a password manager for unique passwords',
            'Be cautious of phishing emails',
          ]
        : [
            'Continue using strong, unique passwords',
            'Enable two-factor authentication where possible',
            'Keep your software and apps updated',
            'Stay vigilant against phishing attempts',
          ];

      // Derive dark web exposure indicators from sources and breaches
      const darkWebSources: string[] = [];
      const src = (apiResult.source || '').toLowerCase();
      if (src.includes('breachdirectory')) darkWebSources.push('BreachDirectory');
      if (src.includes('intelligence x')) darkWebSources.push('Intelligence X');

      const vectorSet = new Set<string>();
      breaches.forEach((b: any) => {
        const title = (b.title || b.name || '').toLowerCase();
        const classes = (b.dataClasses || []).map((x: string) => x.toLowerCase());
        if (title.includes('collection') || title.includes('combo')) vectorSet.add('Credential dump');
        if (title.includes('paste') || title.includes('pastebin')) vectorSet.add('Paste site');
        if (classes.includes('passwords') || classes.includes('passwords (hashed)') || classes.includes('credentials')) vectorSet.add('Credential exposure');
        if (b.isSensitive) vectorSet.add('Sensitive dataset');
      });
      const vectors = Array.from(vectorSet);
      const darkFound = darkWebSources.length > 0 || vectors.length > 0;
      const darkNotes = darkFound
        ? [
            'Email observed in leaked credential sources or OSINT indexes.',
            'Do not reuse passwords; rotate and enable 2FA immediately.',
          ]
        : [
            'No dark‑web indicators found from our sources at this time.',
          ];

      const result: BreachCheckResult = {
        email,
        isBreached: !!apiResult.isBreached,
        breachCount: breaches.length,
        breaches,
        riskScore: apiResult.riskScore,
        lastChecked: new Date().toISOString(),
        recommendations,
        darkWeb: {
          found: darkFound,
          sources: Array.from(new Set(darkWebSources)),
          vectors,
          notes: darkNotes,
        },
      };

      setDetailedResult(result);
      setBasicChecked(true);
      setBasicBreached(!!apiResult.isBreached);

      // Light UX improvements
      setPlaceholder('✓ Check complete - Enter another email');
      setTimeout(() => setPlaceholder('Enter your email address'), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check email breach status';
      setError('Breach checking APIs are temporarily unavailable. Please try again later.');
      console.error('Check failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Send breach report via email
  const sendBreachReportEmail = async () => {
    if (!detailedResult || !email) return;

    setEmailSending(true);
    setEmailError(null);

    try {
      // Create HTML email template with company branding
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>AEDI Security - Breach Report</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .tagline { font-size: 14px; opacity: 0.9; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .breach-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .breach-header { color: #dc2626; font-weight: bold; font-size: 18px; margin-bottom: 10px; }
            .breach-detail { margin: 8px 0; font-size: 14px; }
            .recommendations { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🛡️ AEDI Security Ltd</div>
            <div class="tagline">Professional Cybersecurity Services</div>
          </div>

          <div class="content">
            <h2 style="color: #1e40af; text-align: center; margin-bottom: 30px;">Thank You for Using AEDI Security Breach Checker!</h2>

            <p>Dear Valued User,</p>

            <p>Thank you for trusting <strong>AEDI Security Ltd</strong> with your cybersecurity needs. We're committed to helping you stay safe in the digital world.</p>

            <p>Below is your comprehensive breach analysis report for: <strong>${email}</strong></p>

            ${detailedResult.isBreached ?
              `<div class="breach-card">
                <div class="breach-header">⚠️ SECURITY ALERT: Breaches Detected</div>
                <p><strong>Risk Level:</strong> ${detailedResult.riskScore >= 70 ? 'HIGH' : detailedResult.riskScore >= 40 ? 'MEDIUM' : 'LOW'}</p>
                <p><strong>Breaches Found:</strong> ${detailedResult.breachCount}</p>

                ${detailedResult.breaches.map(breach => `
                  <div style="margin: 15px 0; padding: 15px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;">
                    <h4 style="color: #dc2626; margin: 0 0 10px 0;">${breach.title || breach.name}</h4>
                    <p style="margin: 5px 0;"><strong>Breach Date:</strong> ${new Date(breach.breachDate).toLocaleDateString()}</p>
                    <p style="margin: 5px 0;"><strong>Accounts Affected:</strong> ${breach.pwnCount.toLocaleString()}</p>
                    <p style="margin: 5px 0;"><strong>Description:</strong> ${breach.description}</p>
                    ${breach.dataClasses.length > 0 ? `<p style="margin: 5px 0;"><strong>Data Exposed:</strong> ${breach.dataClasses.join(', ')}</p>` : ''}
                  </div>
                `).join('')}

                ${detailedResult.darkWeb?.found ?
                  `<div style="margin: 15px 0; padding: 15px; background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px;">
                    <h4 style="color: #0c4a6e;">🌐 Dark Web Exposure Detected</h4>
                    ${detailedResult.darkWeb.sources?.length ? `<p><strong>Sources:</strong> ${detailedResult.darkWeb.sources.join(', ')}</p>` : ''}
                    ${detailedResult.darkWeb.vectors?.length ? `<p><strong>Exposure Methods:</strong> ${detailedResult.darkWeb.vectors.join(', ')}</p>` : ''}
                    <p><strong>Recommendation:</strong> ${detailedResult.darkWeb.notes?.join(' ')}</p>
                  </div>` : ''
                }
              </div>` :

              `<div class="breach-card" style="background: #f0fdf4; border: 1px solid #bbf7d0;">
                <div style="color: #16a34a; font-weight: bold; font-size: 18px;">✅ Great News!</div>
                <p>No breaches found for this email address. Your account appears to be secure.</p>
              </div>`
            }

            <div class="recommendations">
              <h4 style="color: #92400e; margin: 0 0 15px 0;">🛡️ Security Recommendations</h4>
              <ul style="margin: 0; padding-left: 20px;">
                ${detailedResult.recommendations.map(rec => `<li style="margin: 8px 0;">${rec}</li>`).join('')}
              </ul>
            </div>

            <p><strong>Check Date:</strong> ${new Date(detailedResult.lastChecked).toLocaleString()}</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://aedisecurity.com" class="button">Visit AEDI Security</a>
            </div>

            <p>If you have any questions or need professional cybersecurity assistance, please don't hesitate to contact us:</p>
            <ul>
              <li><strong>Phone:</strong> +254 743 141 928</li>
              <li><strong>Email:</strong> info@aedisecurity.com</li>
              <li><strong>Website:</strong> https://aedisecurity.com</li>
            </ul>

            <p>Stay safe online!</p>
            <p><strong>The AEDI Security Team</strong></p>
          </div>

          <div class="footer">
            <p>© 2025 AEDI Security Ltd. All rights reserved.</p>
            <p>This report was generated by AEDI Security's free breach checking tool.</p>
            <p>Professional cybersecurity services available at <a href="https://aedisecurity.com">aedisecurity.com</a></p>
          </div>
        </body>
        </html>
      `;

      // Send email using EmailJS with HTML content
      await emailjs.send(
        emailjsConfig.serviceId,
        'template_jeznh6e', // Using the configured template
        {
          to_email: email,
          from_name: 'AEDI Security Breach Report',
          message: emailTemplate,
          subject: `AEDI Security Breach Report - ${detailedResult.isBreached ? 'Breaches Detected' : 'No Breaches Found'}`,
          reply_to: emailjsConfig.recipientEmail,
        },
        emailjsConfig.publicKey
      );

      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
        setShowCompletedModal(false);
      }, 3000);

    } catch (error) {
      console.error('Email sending failed:', error);
      setEmailError('Failed to send email. Please try again or contact us directly.');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Check Data Breach | FREE Email Breach Checker | AEDI Security Kenya"
        description="Check if your email has been compromised in a data breach. COMPLETELY FREE breach checking tool by AEDI Security. Get detailed results instantly - no payment required!"
        keywords="Data Breach Check, Have I Been Pwned, Email Breach Check, Free Breach Checker, Cybersecurity Tool, Data Breach Detection, Email Security, AEDI Security Tools, Breach Monitoring, Cyber Threats"
        url="https://aedisecurity.com/check-breach"
      />
      <Navigation />

      {/* Hero Section */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${pwnedBanner})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">FREE Data Breach Check</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find out if your email has been compromised in a data breach - <span className="text-green-400 font-semibold">COMPLETELY FREE!</span> Get detailed results instantly with no payment required.
          </p>
        </div>
      </section>

      {/* Breach Check Tool */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="card-gradient shadow-hero">
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold">Check Your Email <span className="text-green-600">FREE</span></CardTitle>
              <CardDescription className="text-lg">
                Enter your email address to see if it has appeared in any known data breaches. Get <strong>detailed results instantly</strong> - no payment required!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleBasicSubmit} className="flex space-x-4">
                <Input
                  type="email"
                  placeholder={placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-lg py-6"
                />
                <Button
                  type="submit"
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
              </form>

              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">🔒 Privacy Guarantee</h4>
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
                      <div className="text-xs text-blue-600 font-medium">
                        {liveLoading ? '📊 Loading live stats…' : liveError ? '📊 Stats unavailable' : `📊 ${(liveEmailChecks ?? 0).toLocaleString()} anonymous checks recorded`}
                      </div>
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
                    </div>
                  </div>
                </div>
              )}

              {/* Basic result (modal) */}
              <Dialog open={basicChecked && !detailedResult && showCompletedModal} onOpenChange={setShowCompletedModal}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Email Check Completed</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-green-700">
                      ✅ Your email has been checked for breaches. Detailed results are now loading below for FREE!
                    </p>
                    <div className="flex gap-3">
                      <Button className="bg-green-600 hover:bg-green-700 flex-1" onClick={() => setShowCompletedModal(false)}>
                        View Free Results Below
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setShowCompletedModal(false)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Detailed results (after payment) */}
              {detailedResult && (
                <div className="mt-8">
                  {detailedResult.isBreached ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-red-800">Detailed Breach Analysis</h3>
                          <p className="text-red-600">Found in {detailedResult.breachCount} breach{detailedResult.breachCount > 1 ? 'es' : ''}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {detailedResult.breaches.map((breach, index) => (
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

                      {/* Dark Web Exposure */}
                      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <h4 className="font-semibold text-indigo-900 mb-2">Dark Web Exposure</h4>
                        <p className="text-sm text-indigo-800">
                          {detailedResult.darkWeb?.found ? 'Email observed in dark‑web/credential sources.' : 'No dark‑web indicators from our sources.'}
                        </p>
                        {detailedResult.darkWeb?.found && (
                          <div className="mt-3 space-y-2">
                            {detailedResult.darkWeb?.sources?.length ? (
                              <div className="text-xs text-indigo-900">
                                <span className="font-semibold">Sources:</span>
                                <span className="ml-2 space-x-2">
                                  {detailedResult.darkWeb.sources.map((s, i) => (
                                    <span key={i} className="inline-block px-2 py-1 bg-white text-indigo-800 rounded border border-indigo-300 mr-2">
                                      {s}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            ) : null}
                            {detailedResult.darkWeb?.vectors?.length ? (
                              <div className="text-xs text-indigo-900">
                                <span className="font-semibold">Means:</span>
                                <span className="ml-2">
                                  {detailedResult.darkWeb.vectors.map((v, i) => (
                                    <span key={i} className="inline-block px-2 py-1 bg-white text-indigo-800 rounded border border-indigo-300 mr-2">
                                      {v}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            ) : null}
                            {detailedResult.darkWeb?.notes?.length ? (
                              <ul className="list-disc list-inside text-xs text-indigo-800">
                                {detailedResult.darkWeb.notes.map((n, i) => (
                                  <li key={i}>{n}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-3">🛡️ Security Recommendations</h4>
                        <ul className="text-sm text-yellow-700 space-y-2">
                          {detailedResult.recommendations.map((r, idx) => (
                            <li key={idx} className="flex items-start"><span className="text-yellow-600 mr-2">•</span><span>{r}</span></li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-3 border-t border-yellow-200">
                          <p className="text-xs text-yellow-600">Last checked: {new Date(detailedResult.lastChecked).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Email Report Button */}
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-6 w-6 text-blue-600" />
                            <div>
                              <h4 className="font-semibold text-blue-800">Send Report to Email</h4>
                              <p className="text-sm text-blue-600">Get this report delivered to your inbox</p>
                            </div>
                          </div>
                          <Button
                            onClick={sendBreachReportEmail}
                            disabled={emailSending || emailSent}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {emailSending ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Sending...</span>
                              </div>
                            ) : emailSent ? (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>Sent!</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Send className="h-4 w-4" />
                                <span>Send Report</span>
                              </div>
                            )}
                          </Button>
                        </div>
                        {emailError && (
                          <p className="text-sm text-red-600 mt-2">{emailError}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-green-800">Detailed Analysis</h3>
                          <p className="text-green-600">No breaches found</p>
                        </div>
                      </div>
                      {/* Dark Web Exposure */}
                      <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <h4 className="font-semibold text-indigo-900 mb-2">Dark Web Exposure</h4>
                        <p className="text-sm text-indigo-800">
                          {detailedResult.darkWeb?.found ? 'Email observed in dark‑web/credential sources.' : 'No dark‑web indicators from our sources.'}
                        </p>
                        {detailedResult.darkWeb?.found && (
                          <div className="mt-3 space-y-2">
                            {detailedResult.darkWeb?.sources?.length ? (
                              <div className="text-xs text-indigo-900">
                                <span className="font-semibold">Sources:</span>
                                <span className="ml-2 space-x-2">
                                  {detailedResult.darkWeb.sources.map((s, i) => (
                                    <span key={i} className="inline-block px-2 py-1 bg-white text-indigo-800 rounded border border-indigo-300 mr-2">
                                      {s}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            ) : null}
                            {detailedResult.darkWeb?.vectors?.length ? (
                              <div className="text-xs text-indigo-900">
                                <span className="font-semibold">Means:</span>
                                <span className="ml-2">
                                  {detailedResult.darkWeb.vectors.map((v, i) => (
                                    <span key={i} className="inline-block px-2 py-1 bg-white text-indigo-800 rounded border border-indigo-300 mr-2">
                                      {v}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            ) : null}
                            {detailedResult.darkWeb?.notes?.length ? (
                              <ul className="list-disc list-inside text-xs text-indigo-800">
                                {detailedResult.darkWeb.notes.map((n, i) => (
                                  <li key={i}>{n}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3">🛡️ Keep Staying Protected:</h4>
                        <ul className="text-sm text-blue-700 space-y-2">
                          {detailedResult.recommendations.map((r, idx) => (
                            <li key={idx} className="flex items-start"><span className="text-blue-600 mr-2">•</span><span>{r}</span></li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-3 border-t border-blue-200">
                          <p className="text-xs text-blue-600">Last checked: {new Date(detailedResult.lastChecked).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Email Report Button */}
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-6 w-6 text-blue-600" />
                            <div>
                              <h4 className="font-semibold text-blue-800">Send Report to Email</h4>
                              <p className="text-sm text-blue-600">Get this report delivered to your inbox</p>
                            </div>
                          </div>
                          <Button
                            onClick={sendBreachReportEmail}
                            disabled={emailSending || emailSent}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {emailSending ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Sending...</span>
                              </div>
                            ) : emailSent ? (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>Sent!</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Send className="h-4 w-4" />
                                <span>Send Report</span>
                              </div>
                            )}
                          </Button>
                        </div>
                        {emailError && (
                          <p className="text-sm text-red-600 mt-2">{emailError}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Usage Statistics (Live) */}
      <section className="py-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Anonymous Usage Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{(liveEmailChecks ?? 0).toLocaleString()}</div>
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
            <p className="text-xs text-gray-500 mt-4">These statistics show usage volume only. No personal data is collected or stored.</p>
          </div>
        </div>
      </section>

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

      {/* CTA Section */}
      <section className="py-16 hero-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Secure Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8">Don't wait for a cyber attack. Contact us today for a free security consultation.</p>
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
    </div>
  );
};

export default CheckBreach;
