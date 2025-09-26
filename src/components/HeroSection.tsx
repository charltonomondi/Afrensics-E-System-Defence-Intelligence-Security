import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { YouTubeModal } from "./YouTubeModal";

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaSecondary?: string;
  backgroundImage: string;
}

const heroSlides: HeroSlide[] = [
  {
    title: "Ready to",
    subtitle: "Secure Your Digital Future?",
    description: "Start with yours. Protect your business with comprehensive cybersecurity solutions tailored for modern enterprises.",
    ctaText: "Get Started Today",
    ctaSecondary: "Learn More",
    backgroundImage: "/src/assets/hero-ransomware.jpg"
  },
  {
    title: "Advanced",
    subtitle: "Threat Protection",
    description: "Stay ahead of evolving cyber threats with our advanced detection and prevention systems powered by AI.",
    ctaText: "Explore Solutions",
    ctaSecondary: "View Services",
    backgroundImage: "/src/assets/hero-app-security.jpg"
  },
  {
    title: "Expert",
    subtitle: "Security Team",
    description: "Professional cybersecurity experts providing 24/7 monitoring, incident response, and strategic guidance.",
    ctaText: "Contact Us",
    ctaSecondary: "Get Quote",
    backgroundImage: "/src/assets/hero-cyber-ready.png"
  }
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setIsAnimating(false);
    }, 400);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      setIsAnimating(false);
    }, 400);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 400);
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative min-h-[75vh] flex items-center overflow-hidden">
      {/* Left Content Section */}
      <div
        className="relative z-10 w-full lg:w-1/2 px-8 lg:px-16 py-16 lg:py-24 min-h-[75vh] flex flex-col justify-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentHero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Background Image Overlay - Semi-transparent to work with diagonal separator */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark/70 via-cyber-primary/50 to-cyber-dark/70" />

        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full animate-float" />
          <div className="absolute top-1/2 -left-12 w-64 h-64 bg-white/3 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-12 left-1/4 w-32 h-32 bg-cyber-primary/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-2xl">
          {/* Hero Content */}
          <div className={`transition-all duration-800 ${isAnimating ? 'animate-hero-slide-out' : 'animate-hero-slide-in'}`}>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {currentHero.title}
              <br />
              <span className="relative">
                {currentHero.subtitle}
                <div className="absolute -bottom-2 left-0 w-32 h-1 bg-cyber-primary rounded-full" />
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {currentHero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/contact">
                <Button size="lg" className="bg-cyber-primary hover:bg-cyber-primary/90 text-white border-0 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 glow-primary">
                  {currentHero.ctaText}
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" className="bg-cyber-primary/10 border-2 border-cyber-primary text-white hover:bg-cyber-primary/30 hover:border-cyber-primary backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
                  {currentHero.ctaSecondary}
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {/* Slide Indicators */}
            <div className="flex gap-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-cyber-primary scale-125 shadow-lg'
                      : 'bg-white/30 hover:bg-cyber-primary/50 hover:scale-110'
                  }`}
                />
              ))}
            </div>

            {/* Arrow Controls */}
            <div className="flex gap-2 ml-6">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal Separator */}
      <div className="absolute inset-y-0 left-1/2 w-32 lg:w-48 z-20 hidden lg:block hero-diagonal-separator">
        <div className="h-full bg-gradient-to-br from-cyber-dark/60 via-cyber-primary/40 to-cyber-dark/60 transform -skew-x-12 -translate-x-6 hero-diagonal-main" />
        <div className="absolute inset-0 h-full bg-cyber-primary/5 transform -skew-x-12 translate-x-2 hero-diagonal-accent" />
      </div>

      {/* Right Video Section */}
      <div className="relative w-full lg:w-1/2 min-h-[75vh] lg:min-h-[75vh] overflow-hidden">
        {/* Interactive Cybersecurity Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3"
          >
            <source src="/assets/videos/video.mp4" type="video/mp4" />
          </video>

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-dark/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/20 to-cyber-dark/20" />

          {/* Animated Cybersecurity Elements */}
          <div className="absolute inset-0">

            {/* Floating Security Indicators */}
            {/* <div className="floating-indicators absolute inset-0">
              <div className="security-node" style={{ top: '15%', left: '20%', animationDelay: '0s' }}>
                <div className="node-pulse"></div>
                <span className="node-label">THREAT DETECTED</span>
              </div>
              <div className="security-node" style={{ top: '35%', left: '60%', animationDelay: '1s' }}>
                <div className="node-pulse"></div>
                <span className="node-label">FIREWALL ACTIVE</span>
              </div>
              <div className="security-node" style={{ top: '55%', left: '30%', animationDelay: '2s' }}>
                <div className="node-pulse"></div>
                <span className="node-label">SCANNING...</span>
              </div>
              <div className="security-node" style={{ top: '75%', left: '70%', animationDelay: '3s' }}>
                <div className="node-pulse"></div>
                <span className="node-label">PROTECTED</span>
              </div>
            </div> */}

            {/* Interactive Particles */}
            <div className="particles-container absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>

            {/* Scanning Lines */}
            <div className="scan-lines absolute inset-0">
              <div className="scan-line" style={{ animationDelay: '0s' }}></div>
              <div className="scan-line" style={{ animationDelay: '2s' }}></div>
              <div className="scan-line" style={{ animationDelay: '4s' }}></div>
            </div>
          </div>
        </div>


        {/* Video Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setIsYouTubeModalOpen(true)}
            className="group relative"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110 border-2 border-white/30">
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-white/10 rounded-full animate-ping" />
          </button>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyber-dark/40 to-transparent" />

      </div>

      {/* YouTube Modal */}
      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        channelUrl="https://www.youtube.com/embed?listType=user_uploads&list=afrensicsSecurity"
      />
    </section>
  );
};