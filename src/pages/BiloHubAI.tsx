import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Cpu, Brain, Network, Bot, Sparkles, ArrowRight, Mail, Zap, Globe, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BiloHubAI = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // Simulate subscription
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
    }, 1000);
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-cyan-500" />,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms to analyze your business data and provide actionable insights."
    },
    {
      icon: <Network className="w-8 h-8 text-teal-500" />,
      title: "Smart Automation",
      description: "Automate repetitive tasks and streamline your business processes with intelligent AI agents."
    },
    {
      icon: <Bot className="w-8 h-8 text-cyan-500" />,
      title: "Virtual Assistants",
      description: "24/7 AI-powered chatbots to handle customer inquiries and support requests."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-teal-500" />,
      title: "Predictive Insights",
      description: "Forecast trends and make data-driven decisions with our predictive AI models."
    },
    {
      icon: <Zap className="w-8 h-8 text-cyan-500" />,
      title: "Instant Processing",
      description: "Lightning-fast AI processing to deliver results in real-time."
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-500" />,
      title: "Pan-African Reach",
      description: "Built specifically for African businesses with local language support."
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="BiloHub AI | Coming Soon | AEDI Security Ltd"
        description="BiloHub AI - Revolutionary AI solutions for African businesses. Subscribe to receive updates on our upcoming AI platform launch."
        keywords="BiloHub AI, Artificial Intelligence, AI for Africa, Business Automation, Machine Learning, African Tech, AI Solutions Kenya"
        url="https://aedisecurity.com/bilohub-ai"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0a0f1a 0%, #111827 50%, #0f172a 100%)'
      }}>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
          {/* Neural network effect */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <circle cx="25%" cy="30%" r="2" fill="#06b6d4">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="75%" cy="25%" r="2" fill="#2dd4bf">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" begin="1s" />
              </circle>
              <circle cx="50%" cy="50%" r="3" fill="#06b6d4">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" begin="0.5s" />
              </circle>
              <circle cx="30%" cy="70%" r="2" fill="#2dd4bf">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" begin="1.5s" />
              </circle>
              <circle cx="70%" cy="75%" r="2" fill="#06b6d4">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" begin="2s" />
              </circle>
              <line x1="25%" y1="30%" x2="50%" y2="50%" stroke="url(#heroGradient)" strokeWidth="1" opacity="0.3" />
              <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="url(#heroGradient)" strokeWidth="1" opacity="0.3" />
              <line x1="50%" y1="50%" x2="30%" y2="70%" stroke="url(#heroGradient)" strokeWidth="1" opacity="0.3" />
              <line x1="50%" y1="50%" x2="70%" y2="75%" stroke="url(#heroGradient)" strokeWidth="1" opacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-300 text-sm font-medium">COMING SOON</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{
            background: 'linear-gradient(135deg, #22d3ee, #2dd4bf)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            BiloHub AI
          </h1>
          
          <p className="text-xl md:text-2xl text-cyan-200 mb-4">
            Africa's Premier AI Business Platform
          </p>
          
          <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
            Empowering African businesses with cutting-edge artificial intelligence solutions. 
            From smart automation to predictive analytics, BiloHub AI brings the future of business to Africa.
          </p>

          {/* Subscribe Form */}
          <div className="max-w-md mx-auto">
            {subscribed ? (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">You're on the list!</h3>
                <p className="text-cyan-200">We'll notify you when BiloHub AI launches.</p>
              </div>
            ) : (
              <Card className="bg-white/5 border-cyan-500/20 backdrop-blur-md">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-white text-lg">Be the first to know</CardTitle>
                  <p className="text-cyan-200 text-sm">Subscribe for exclusive early access</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-white/10 border-cyan-500/30 text-white placeholder:text-cyan-200/50 focus:border-cyan-500"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 border-0"
                      >
                        {loading ? 'Subscribing...' : 'Subscribe'}
                        {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                    </div>
                    <p className="text-xs text-cyan-200/60">
                      Join 500+ business owners waiting for BiloHub AI
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Features Preview */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.slice(0, 6).map((feature, index) => (
              <div key={index} className="bg-white/5 border border-cyan-500/20 rounded-xl p-4 text-center hover:bg-white/10 transition-colors">
                <div className="flex justify-center mb-3">{feature.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful AI Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              BiloHub AI is packed with intelligent features designed specifically for African businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-cyan-500/20 hover:border-cyan-500/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-950 to-teal-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Lock className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Enterprise-Grade Security
          </h2>
          <p className="text-lg text-cyan-100 mb-8">
            Your data is protected with bank-level encryption and compliance with international security standards. 
            Built with security-first approach by AEDI Security, Kenya's trusted cybersecurity partner.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-cyan-200">
              <CheckCircle className="w-5 h-5 text-cyan-400" />
              <span>End-to-end encryption</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-200">
              <CheckCircle className="w-5 h-5 text-cyan-400" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-200">
              <CheckCircle className="w-5 h-5 text-cyan-400" />
              <span>24/7 Monitoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16" style={{
        background: 'linear-gradient(135deg, #0a0f1a 0%, #111827 100%)'
      }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Cpu className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Subscribe now to be among the first to access BiloHub AI when we launch. 
            Early subscribers will receive exclusive launch discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => document.getElementById('subscribe-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 border-0"
            >
              Subscribe for Updates
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton
        variant="floating"
        size="lg"
        phoneNumber="254743141928"
        message="Hi! I'm interested in BiloHub AI. Can you tell me more about it?"
      />
    </div>
  );
};

export default BiloHubAI;
