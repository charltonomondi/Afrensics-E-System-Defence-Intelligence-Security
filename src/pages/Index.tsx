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
import { CheckCircle, Users, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import aediLogo from '@/assets/favicon_logo/aedi.jpeg';
import matchLogo from '@/assets/favicon_logo/match.jpeg';
import oneChurchLogo from '@/assets/favicon_logo/onechurch-logo.png';
import happyHolidays from '@/assets/happyholidays.jpg';

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
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        style={{
          background: 'linear-gradient(135deg, hsl(215 25% 8%), hsl(215 30% 12%), hsl(174 72% 56% / 0.1))'
        }}
      >
        {/* Festive blended background image layer */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${happyHolidays})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            filter: 'saturate(1.05)'
          }}
          aria-hidden="true"
        />
        {/* Dark-to-brand gradient overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 35%, rgba(46,196,182,0.25) 100%)'
          }}
          aria-hidden="true"
        />

        <div className="relative text-center px-4">
          {/* Top seasonal banner inside splash */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6"
               style={{ background: 'linear-gradient(90deg, rgba(185,28,28,0.85), rgba(6,95,70,0.85))', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="text-white text-sm font-semibold tracking-wide">Happy Holidays</span>
            <span className="hidden sm:inline text-white/80 text-sm">from AEDI Security</span>
          </div>

          {/* Logo with animation */}
          <div className="mb-8 animate-pulse">
            <img
              src={aediLogo}
              alt="AEDI Security Logo"
              className="w-32 h-32 mx-auto rounded-full shadow-2xl border-4 border-white/20 animate-bounce"
              style={{ animationDuration: '2s' }}
            />
          </div>

          {/* Welcome + seasonal image row */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white animate-fade-in-up">
              Welcome to
            </h1>
            <h2
              className="text-3xl md:text-4xl font-bold animate-fade-in-up-delay"
              style={{
                background: 'linear-gradient(135deg, hsl(174 72% 56%), hsl(174 82% 70%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              AEDI Security Ltd
            </h2>
            <p className="text-lg md:text-xl animate-fade-in-up-delay-2" style={{ color: 'hsl(174 72% 80%)' }}>
              Kenya's Premier Cybersecurity Firm
            </p>

            {/* Seasonal visual blended with current theme */}
            <div className="mx-auto max-w-2xl">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={happyHolidays}
                  alt="Happy Holidays"
                  className="w-full h-48 md:h-64 object-cover"
                  loading="lazy"
                />
                {/* gradient overlay to blend */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.5) 100%)' }} />
                {/* subtle corner ribbon */}
                <div className="absolute top-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded"
                     style={{ background: 'linear-gradient(90deg, rgba(185,28,28,0.9), rgba(6,95,70,0.9))', border: '1px solid rgba(255,255,255,0.25)' }}>
                  Happy Holidays
                </div>
              </div>
            </div>
          </div>

          {/* Loading indicator */}
          <div className="mt-10">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'hsl(174 72% 56%)', animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'hsl(174 82% 70%)', animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'hsl(174 72% 56%)', animationDelay: '300ms' }}></div>
            </div>
            <p className="mt-4 text-sm" style={{ color: 'hsl(174 72% 80%)' }}>Loading your security experience...</p>

            {/* Skip button */}
            <button
              onClick={skipSplash}
              className="mt-6 px-6 py-2 text-sm rounded-full transition-all duration-300 backdrop-blur-sm"
              style={{
                color: 'hsl(174 72% 80%)',
                border: '1px solid hsl(174 72% 56% / 0.3)',
                background: 'hsl(174 72% 56% / 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'hsl(174 72% 56% / 0.2)';
                e.currentTarget.style.borderColor = 'hsl(174 72% 56% / 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'hsl(174 72% 56% / 0.1)';
                e.currentTarget.style.borderColor = 'hsl(174 72% 56% / 0.3)';
              }}
            >
              Skip Intro
            </button>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full animate-ping" style={{ border: '1px solid hsl(174 72% 56%)' }}></div>
          <div className="absolute top-20 right-20 w-16 h-16 rounded-full animate-ping" style={{ border: '1px solid hsl(174 82% 70%)', animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 rounded-full animate-ping" style={{ border: '1px solid hsl(174 72% 56%)', animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full animate-ping" style={{ border: '1px solid hsl(174 82% 70%)', animationDelay: '0.5s' }}></div>
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
                  <CardTitle className="text-2xl font-bold text-primary">Data Protection</CardTitle>
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
        message="Hi! I'm interested in AEDI Security's cybersecurity services. Can you help me?"
      />
    </div>
  );
};

export default Index;
