import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroCyberReady from '@/assets/hero-cyber-ready.jpg';
import heroRansomware from '@/assets/hero-ransomware.jpg';
import heroPentest from '@/assets/hero-pentest.jpg';
import heroAppSecurity from '@/assets/hero-app-security.webp';
import heroTraining from '@/assets/hero-training.jpg';

const slides = [
  {
    id: 1,
    image: heroCyberReady,
    title: "Is Your Business Cyber Ready?",
    description: "Protect your digital assets with comprehensive cybersecurity solutions tailored for modern businesses.",
    cta: "Assess Your Security"
  },
  {
    id: 2,
    image: heroRansomware,
    title: "Ransomware Threats on the Rise",
    description: "Stay ahead of evolving cyber threats with our advanced detection and prevention systems.",
    cta: "Learn More"
  },
  {
    id: 3,
    image: heroPentest,
    title: "Get Pen-Tested by Professionals",
    description: "Identify vulnerabilities before attackers do with our expert penetration testing services.",
    cta: "Schedule Test"
  },
  {
    id: 4,
    image: heroAppSecurity,
    title: "Secure Your Web & Mobile Apps Today",
    description: "Comprehensive application security testing to protect your digital products and customer data.",
    cta: "Start Testing"
  },
  {
    id: 5,
    image: heroTraining,
    title: "Train Your Staff. Stop Human Errors.",
    description: "Empower your team with cybersecurity awareness training to prevent social engineering attacks.",
    cta: "Train Your Team"
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto fade-in">
                {slide.description}
              </p>
              <Link to={
                slide.cta === "Assess Your Security" ? "/check-breach" :
                slide.cta === "Learn More" ? "/blog" :
                slide.cta === "Schedule Test" ? "/contact" :
                slide.cta === "Start Testing" ? "/services" :
                slide.cta === "Train Your Team" ? "/services" : "/services"
              }>
                <Button 
                  size="lg" 
                  className="primary-gradient glow-primary text-white font-semibold px-8 py-3 hover:scale-105 transition-transform duration-200"
                >
                  {slide.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentSlide ? 'bg-primary' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;