import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import ServicesPreview from '@/components/ServicesPreview';
import ClientsSection from '@/components/ClientsSection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Award, Clock, Shield, Lock, Eye, Activity, Cpu, Brain, Network, Bot, Microscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import aediLogo from '@/assets/favicon_logo/aedi.jpeg';
import matchLogo from '@/assets/favicon_logo/match.jpeg';
import oneChurchLogo from '@/assets/favicon_logo/onechurch-logo.png';

const Index = () => {
  const { t } = useTranslation();
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade out animation to complete before hiding splash
      setTimeout(() => {
        setShowSplash(false);
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  const skipSplash = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 500);
  };

  // Enhanced Splash Screen with Cyber + AI Tech Theme - Blue/Cyan Theme
  if (showSplash) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        style={{
          background: 'linear-gradient(135deg, #0a0f1a 0%, #111827 50%, #0f172a 100%)'
        }}
      >
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px),
                linear-gradient(rgba(45,212,191,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(45,212,191,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px, 50px 50px, 100px 100px, 100px 100px'
            }}
          />
          {/* Neural network animation overlay - Blue/Cyan */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="aiGradientBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
              </defs>
              {/* Animated neural network lines */}
              <circle cx="20%" cy="30%" r="3" fill="#06b6d4" className="animate-pulse">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="80%" cy="25%" r="3" fill="#22d3ee" className="animate-pulse">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="0.5s" />
              </circle>
              <circle cx="50%" cy="50%" r="4" fill="#2dd4bf" className="animate-pulse">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="1s" />
              </circle>
              <circle cx="25%" cy="75%" r="3" fill="#06b6d4" className="animate-pulse">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="1.5s" />
              </circle>
              <circle cx="75%" cy="70%" r="3" fill="#22d3ee" className="animate-pulse">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="0.3s" />
              </circle>
              {/* Connecting lines */}
              <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="url(#aiGradientBlue)" strokeWidth="1" opacity="0.3" />
              <line x1="80%" y1="25%" x2="50%" y2="50%" stroke="url(#aiGradientBlue)" strokeWidth="1" opacity="0.3" />
              <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="url(#aiGradientBlue)" strokeWidth="1" opacity="0.3" />
              <line x1="50%" y1="50%" x2="75%" y2="70%" stroke="url(#aiGradientBlue)" strokeWidth="1" opacity="0.3" />
              <line x1="20%" y1="30%" x2="80%" y2="25%" stroke="url(#aiGradientBlue)" strokeWidth="1" opacity="0.2" />
              <line x1="25%" y1="75%" x2="75%" y2="70%" stroke="url(#aiGradientBlue)" strokeWidth="1" opacity="0.2" />
            </svg>
          </div>
        </div>

        {/* Floating AI & Cyber Icons - Blue/Cyan Theme */}
        <div className="absolute inset-0 pointer-events-none">
          <Brain className="absolute top-16 left-16 w-14 h-14 text-cyan-500/20" />
          <Cpu className="absolute top-32 right-28 w-12 h-12 text-cyan-500/20" />
          <Network className="absolute bottom-32 left-28 w-14 h-14 text-teal-500/20" />
          <Bot className="absolute bottom-20 right-20 w-14 h-14 text-teal-500/20" />
          <Shield className="absolute top-1/3 right-1/4 w-10 h-10 text-cyan-500/20" />
          <Lock className="absolute bottom-1/3 left-1/4 w-12 h-12 text-cyan-500/20" />
          <Eye className="absolute top-24 right-1/3 w-10 h-10 text-teal-500/20" />
          <Activity className="absolute bottom-1/4 right-1/3 w-10 h-10 text-cyan-500/20" />
        </div>

        {/* Glowing Orb Effects - Blue/Cyan Theme */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative text-center px-4 z-10 max-w-4xl">
          {/* Dual Badge - Cybersecurity + AI - Blue/Cyan Theme */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300 text-sm font-medium tracking-wide">ARTIFICIAL INTELLIGENCE</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-teal-300 text-sm font-medium tracking-wide">CYBERSECURITY</span>
            </div>
          </div>

          {/* Logo with enhanced animation */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-cyan-500/20 blur-3xl rounded-full" />
            <div className="relative">
              <img
                src={aediLogo}
                alt="AEDI Security Logo"
                className="w-40 h-40 mx-auto rounded-full shadow-2xl border-4 border-cyan-500/30 relative z-10 animate-bounce"
                style={{ animationDuration: '2s' }}
              />
              {/* Rotating ring effects - Blue/Cyan */}
              <div className="absolute inset-0 w-40 h-40 mx-auto rounded-full border-2 border-cyan-500/20 animate-spin" style={{ animationDuration: '10s' }} />
              <div className="absolute inset-2 w-36 h-36 mx-auto rounded-full border-2 border-teal-500/15 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              <div className="absolute inset-4 w-32 h-32 mx-auto rounded-full border border-cyan-500/10 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
          </div>

          {/* Company Name with enhanced gradient - Blue/Cyan */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white animate-fade-in-up">
              Welcome to
            </h1>
            <h2
              className="text-4xl md:text-5xl font-bold animate-fade-in-up-delay"
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #2dd4bf, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 3s ease infinite'
              }}
            >
              AEDI Security Ltd
            </h2>
            <p className="text-lg md:text-xl animate-fade-in-up-delay-2 text-cyan-200/80">
              AI-Powered Cybersecurity Solutions
            </p>
            <p className="text-md animate-fade-in-up-delay-2 text-teal-200/70">
              Kenya's Premier Technology & Security Firm
            </p>
          </div>

          {/* Services Pills - Blue/Cyan Theme */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up-delay-3">
            <div className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI/ML Security
            </div>
            <div className="px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Penetration Testing
            </div>
            <div className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Agents
            </div>
            <div className="px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm flex items-center gap-2">
              <Network className="w-4 h-4" />
              Network Security
            </div>
          </div>

          {/* Stats Row - Blue/Cyan Theme */}
          <div className="flex justify-center gap-6 md:gap-10 mt-10 animate-fade-in-up-delay-3">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">500+</div>
              <div className="text-xs md:text-sm text-cyan-200/60">Clients Protected</div>
            </div>
            <div className="w-px bg-gradient-to-b from-cyan-500/30 to-teal-500/30" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">24/7</div>
              <div className="text-xs md:text-sm text-teal-200/60">AI Monitoring</div>
            </div>
            <div className="w-px bg-gradient-to-b from-cyan-500/30 to-teal-500/30" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">98%</div>
              <div className="text-xs md:text-sm text-cyan-200/60">Success Rate</div>
            </div>
            <div className="w-px bg-gradient-to-b from-teal-500/30 to-cyan-500/30 hidden md:block" />
            <div className="text-center hidden md:block">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">AI</div>
              <div className="text-xs md:text-sm text-teal-200/60">Powered</div>
            </div>
          </div>

          {/* Loading indicator */}
          <div className="mt-10">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 rounded-full animate-bounce bg-cyan-400" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 rounded-full animate-bounce bg-teal-400" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 rounded-full animate-bounce bg-cyan-400" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="mt-4 text-sm text-cyan-200/70">Initializing AI security systems...</p>

            {/* Skip button */}
            <button
              onClick={skipSplash}
              className="mt-6 px-6 py-2 text-sm rounded-full transition-all duration-300 backdrop-blur-sm border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 hover:border-cyan-500/50"
            >
              Skip Intro
            </button>
          </div>
        </div>

        {/* Corner Tech Decorations - Blue/Cyan */}
        <div className="absolute top-4 left-4 w-24 h-24 border-l-2 border-t-2 border-cyan-500/30" />
        <div className="absolute top-4 right-4 w-24 h-24 border-r-2 border-t-2 border-teal-500/30" />
        <div className="absolute bottom-4 left-4 w-24 h-24 border-l-2 border-b-2 border-teal-500/30" />
        <div className="absolute bottom-4 right-4 w-24 h-24 border-r-2 border-b-2 border-cyan-500/30" />

        {/* CSS for additional animations */}
        <style>{`
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
          }
          .animate-fade-in-up-delay {
            animation: fadeInUp 0.6s ease-out 0.2s forwards;
            opacity: 0;
          }
          .animate-fade-in-up-delay-2 {
            animation: fadeInUp 0.6s ease-out 0.4s forwards;
            opacity: 0;
          }
          .animate-fade-in-up-delay-3 {
            animation: fadeInUp 0.6s ease-out 0.6s forwards;
            opacity: 0;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title="Afrensics E-System Defence & Intelligence Security Ltd | AEDI Security | Kenya's Premier Cybersecurity & AI Firm"
        description="AEDI Security Ltd - Kenya's leading cybersecurity and AI firm specializing in penetration testing, vulnerability assessment, AI/ML security, machine learning security, AI agents, incident response, cybersecurity research, and software development. Professional services from certified experts in Nairobi, Kenya."
        keywords="Afrensics E-System Defence and Intelligence Security, AEDI Security Ltd, Cybersecurity Kenya, AI Security, Artificial Intelligence, Machine Learning, Software Development, Penetration Testing, Incident Response, Cybersecurity Research, Machine Learning Security, AI Agents, Afrensics, AEDI, Security, Vulnerability Assessment, Ethical Hacking, Cyber Threats, Data Protection, Network Security, Information Security, Cyber Defense, Security Consulting, Kenya Cybersecurity, East Africa Security, Digital Forensics, Security Audit, Compliance, ISO 27001, Nairobi Cybersecurity, AI Services Kenya"
        url="https://aedisecurity.com/"
      />
      <Navigation />
      {/* New Hero Section */}
      <HeroSection />
      
      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t('about.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('about.description')}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">{t('about.features.monitoring')}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">{t('about.features.testing')}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">{t('about.features.auditing')}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">{t('about.features.response')}</span>
                </div>
              </div>
              <Link to="/about">
                <Button size="lg" className="primary-gradient text-white">
                  {t('about.cta')}
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl font-bold text-primary">500+</CardTitle>
                  <CardDescription>{t('about.stats.clients')}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl font-bold text-primary">98%</CardTitle>
                  <CardDescription>{t('about.stats.success')}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl font-bold text-primary">24/7</CardTitle>
                  <CardDescription>{t('about.stats.support')}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl font-bold text-primary">AI Powered</CardTitle>
                  <CardDescription>{t('about.stats.certified')}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <ServicesPreview />

      <ClientsSection />

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What our clients say</h2>
            <p className="text-muted-foreground mt-2">Trusted by organizations across industries</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-card h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <img src={matchLogo} alt="Match Electricals Ltd" className="w-14 h-14 rounded-md object-cover" />
                <div>
                  <CardTitle>Match Electricals Ltd</CardTitle>
                  <CardDescription>Client Testimonial</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p><strong>Afrensics Security Ltd</strong>, led by <strong>C.E.O. Charlton Omondi</strong>, has been an exceptional technology partner for Match Electricals Ltd. They crafted a <strong>dynamic website</strong> that elevates our online presence and delivered a <strong>fleet management system</strong> that streamlines our vehicle operations with remarkable efficiency.</p>
                <p>Their blend of innovation, professionalism, and on-time delivery makes them a trusted choice for any organization seeking impactful digital solutions. We proudly recommend <strong>Afrensics Security Ltd</strong> for their outstanding work.</p>
              </CardContent>
            </Card>

            <Card className="shadow-card h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <img src={oneChurchLogo} alt="OneChurch" className="w-14 h-14 rounded-md object-contain bg-white p-1" />
                <div>
                  <CardTitle>OneChurch</CardTitle>
                  <CardDescription>Client Testimonial</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>Working with <strong>Afrensics Security Ltd</strong> on the <strong>OneChurch church management system landing page</strong> was such a great experience. The team truly understood our requirements, delivered on time, and created a page that is not only beautiful and responsive but also easy to use.</p>
                <p>Their work has significantly boosted our online presence and perfectly represents the vision of OneChurch. We would definitely recommend <strong>Afrensics Security Ltd</strong> to anyone looking for a talented and reliable development partner.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                {t('cta.freeAssessment')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-cyber-dark bg-white hover:bg-gray-100 hover:text-cyber-dark px-8 py-3 transition-all duration-300">
                {t('cta.contactExperts')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton
        variant="floating"
        size="lg"
        phoneNumber="254743141928"
        message="Hi! I'm interested in AEDI Security's cybersecurity and AI services. Can you help me?"
      />
    </div>
  );
};

export default Index;
