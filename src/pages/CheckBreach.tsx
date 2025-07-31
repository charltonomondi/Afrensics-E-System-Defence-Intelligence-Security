import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, Search, Shield, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import pwnedBanner from '@/assets/banner/pwned.jpg';

const CheckBreach = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    if (!email) return;
    
    setLoading(true);
    
    // Simulate API call to breach database
    setTimeout(() => {
      // Mock results - in real implementation, this would call HaveIBeenPwned API or custom database
      const mockBreaches = [
        { name: "Adobe", date: "2013-10-04", compromised: "152,445,165" },
        { name: "LinkedIn", date: "2012-05-05", compromised: "164,611,595" },
        { name: "Dropbox", date: "2012-07-01", compromised: "68,648,009" }
      ];
      
      const isCompromised = Math.random() > 0.6; // 40% chance of being compromised for demo
      
      setResult({
        email,
        compromised: isCompromised,
        breaches: isCompromised ? mockBreaches.slice(0, Math.floor(Math.random() * 3) + 1) : [],
        total: isCompromised ? Math.floor(Math.random() * 3) + 1 : 0
      });
      
      setLoading(false);
    }, 2000);
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
            {t('checkBreach.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('checkBreach.subtitle')}
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
                  placeholder="Enter your email address"
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

              {/* Results */}
              {result && (
                <div className="mt-8">
                  {result.compromised ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                        <div>
                          <h3 className="text-xl font-bold text-red-800">Email Found in Breaches</h3>
                          <p className="text-red-600">
                            Your email was found in {result.total} breach{result.total > 1 ? 'es' : ''}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {result.breaches.map((breach: any, index: number) => (
                          <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-red-800">{breach.name}</h4>
                                <p className="text-sm text-red-600">Breach Date: {breach.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-red-600">Accounts Affected:</p>
                                <p className="font-semibold text-red-800">{breach.compromised}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">What should you do?</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Change your password immediately</li>
                          <li>• Enable two-factor authentication</li>
                          <li>• Monitor your accounts for suspicious activity</li>
                          <li>• Consider using a password manager</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <h3 className="text-xl font-bold text-green-800">Good News!</h3>
                          <p className="text-green-600">
                            Your email was not found in any known breaches
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Stay Protected:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Use strong, unique passwords for all accounts</li>
                          <li>• Enable two-factor authentication where possible</li>
                          <li>• Keep your software and apps updated</li>
                          <li>• Be cautious of phishing emails</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
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
                <CardTitle>How We Protect You</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We use secure, encrypted connections and don't store your email addresses. 
                  All searches are anonymous and your privacy is protected.
                </p>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Professional Security Help?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Our cybersecurity experts can help secure your business and prevent future breaches
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Security Assessment
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cyber-dark px-8 py-3">
              Contact Experts
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      {/* <WhatsAppFloat /> */}
    </div>
  );
};

export default CheckBreach;