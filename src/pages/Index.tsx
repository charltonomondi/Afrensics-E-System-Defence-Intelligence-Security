import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSlider from '@/components/HeroSlider';
import ServicesPreview from '@/components/ServicesPreview';
import ClientsSection from '@/components/ClientsSection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import aediLogo from '@/assets/favicon_logo/aedi.jpeg';

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

  // Splash Screen Component
  if (showSplash) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-center">
          {/* Logo with animation */}
          <div className="mb-8 animate-pulse">
            <img
              src={aediLogo}
              alt="AEDI Security Logo"
              className="w-32 h-32 mx-auto rounded-full shadow-2xl border-4 border-white/20 animate-bounce"
              style={{ animationDuration: '2s' }}
            />
          </div>

          {/* Welcome text with typing animation */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white animate-fade-in-up">
              Welcome to
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent animate-fade-in-up-delay">
              AEDI Security Ltd
            </h2>
            <p className="text-lg md:text-xl text-blue-100 animate-fade-in-up-delay-2">
              Kenya's Premier Cybersecurity Firm
            </p>
          </div>

          {/* Loading indicator */}
          <div className="mt-12">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-blue-200 mt-4 text-sm">Loading your security experience...</p>

            {/* Skip button */}
            <button
              onClick={skipSplash}
              className="mt-6 px-6 py-2 text-sm text-blue-200 border border-blue-200/30 rounded-full hover:bg-blue-200/10 hover:border-blue-200/50 transition-all duration-300 backdrop-blur-sm"
            >
              Skip Intro
            </button>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full animate-ping"></div>
          <div className="absolute top-20 right-20 w-16 h-16 border border-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 border border-white rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title="Afrensics E-System Defence & Intelligence Security Ltd | AEDI Security | Kenya's Premier Cybersecurity Firm"
        description="AEDI Security Ltd - Kenya's leading cybersecurity firm specializing in penetration testing, vulnerability assessment, incident response, cybersecurity research, machine learning security, and software development. Professional cybersecurity services from certified experts in Nairobi, Kenya."
        keywords="Afrensics E-System Defence and Intelligence Security, AEDI Security Ltd, Cybersecurity Kenya, Software Development, Penetration Testing, Incident Response, Cybersecurity Research, Machine Learning Security, Afrensics, AEDI, Security, Vulnerability Assessment, Ethical Hacking, Cyber Threats, Data Protection, Network Security, Information Security, Cyber Defense, Security Consulting, Kenya Cybersecurity, East Africa Security, Digital Forensics, Security Audit, Compliance, ISO 27001, Nairobi Cybersecurity"
        url="https://aedisecurity.com/"
      />
      <Navigation />
      <HeroSlider />
      
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
                  <CardTitle className="text-2xl font-bold text-primary">ISO 27001</CardTitle>
                  <CardDescription>{t('about.stats.certified')}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <ServicesPreview />

      <ClientsSection />

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
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cyber-dark px-8 py-3">
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
        message="Hi! I'm interested in AEDI Security's cybersecurity services. Can you help me?"
      />
    </div>
  );
};

export default Index;
