import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, Search, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PenetrationTestingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PenetrationTestingPopup: React.FC<PenetrationTestingPopupProps> = ({ isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of penetration testing poster-style images and content
  const popupVariants = [
    {
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "FREE Penetration Testing",
      subtitle: "Discover Your Security Vulnerabilities",
      description: "Get a comprehensive security assessment of your systems absolutely FREE. Our expert ethical hackers will identify potential threats before malicious actors do.",
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Advanced Security Audit",
      subtitle: "Professional Penetration Testing",
      description: "Our certified security experts use cutting-edge tools and methodologies to simulate real-world attacks and strengthen your defenses.",
      icon: <Lock className="w-8 h-8 text-green-500" />,
      gradient: "from-green-600 to-teal-600"
    },
    {
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Vulnerability Assessment",
      subtitle: "Complete Security Analysis",
      description: "Identify security gaps in your network, applications, and infrastructure with our comprehensive penetration testing services.",
      icon: <Search className="w-8 h-8 text-orange-500" />,
      gradient: "from-orange-600 to-red-600"
    },
    {
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Cyber Threat Detection",
      subtitle: "Stay Ahead of Attackers",
      description: "Don't wait for a breach! Our proactive penetration testing reveals hidden vulnerabilities and provides actionable security recommendations.",
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      gradient: "from-red-600 to-pink-600"
    },
    {
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Network Security Testing",
      subtitle: "Protect Your Infrastructure",
      description: "Comprehensive network penetration testing to identify weaknesses in your network architecture and security controls.",
      icon: <Shield className="w-8 h-8 text-cyan-500" />,
      gradient: "from-cyan-600 to-blue-600"
    },
    {
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Web Application Testing",
      subtitle: "Secure Your Applications",
      description: "Identify OWASP Top 10 vulnerabilities and other security flaws in your web applications before attackers exploit them.",
      icon: <Search className="w-8 h-8 text-purple-500" />,
      gradient: "from-purple-600 to-indigo-600"
    }
  ];

  const currentVariant = popupVariants[currentImageIndex];

  // Rotate through different variants
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % popupVariants.length);
      }, 8000); // Change variant every 8 seconds while popup is open

      return () => clearInterval(interval);
    }
  }, [isOpen, popupVariants.length]);

  // Handle ESC key to close popup
  useEffect(() => {
    if (isOpen) {
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGetFreeTest = () => {
    // Redirect to contact page or open contact form
    window.location.href = '/contact?service=penetration-testing';
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative max-w-3xl w-full max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl border-2 border-white border-opacity-20 animate-in slide-in-from-bottom-4 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Image with Overlay */}
        <div className="relative h-full min-h-[450px]">
          <img
            src={currentVariant.image}
            alt="Penetration Testing"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 filter brightness-75"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${currentVariant.gradient} opacity-85`}></div>

          {/* Poster-style border effect */}
          <div className="absolute inset-4 border-2 border-white border-opacity-30 rounded-2xl"></div>
          
          {/* Special Offer Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide shadow-xl border border-white border-opacity-50 animate-pulse">
              🔥 LIMITED OFFER
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-20 p-3 bg-red-600 bg-opacity-80 hover:bg-opacity-100 hover:bg-red-700 rounded-full transition-all duration-200 backdrop-blur-md border-2 border-white border-opacity-50 shadow-lg cursor-pointer"
            title="Close popup"
            aria-label="Close popup"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="w-full px-6 py-8 text-white">
              <div className="max-w-2xl mx-auto text-center">
                {/* Icon with enhanced styling */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white bg-opacity-25 rounded-full backdrop-blur-md shadow-xl border border-white border-opacity-30">
                    {currentVariant.icon}
                  </div>
                </div>

                {/* Title with poster-style typography */}
                <h2 className="text-3xl md:text-4xl font-black mb-3 animate-in slide-in-from-left-4 duration-700 tracking-tight text-shadow-lg">
                  {currentVariant.title}
                </h2>

                {/* Subtitle with enhanced styling */}
                <h3 className="text-lg md:text-xl font-bold mb-4 text-yellow-200 animate-in slide-in-from-right-4 duration-700 delay-200 tracking-wide text-shadow-md">
                  {currentVariant.subtitle}
                </h3>

                {/* Description with better readability */}
                <p className="text-sm md:text-base mb-6 text-gray-50 leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-400 font-medium text-shadow-sm">
                  {currentVariant.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-3 gap-2 mb-6 animate-in slide-in-from-bottom-4 duration-700 delay-600">
                  <div className="flex items-center justify-center space-x-1 bg-white bg-opacity-10 rounded-lg p-2 backdrop-blur-sm">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-xs font-medium">100% Free</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 bg-white bg-opacity-10 rounded-lg p-2 backdrop-blur-sm">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-xs font-medium">Expert Analysis</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 bg-white bg-opacity-10 rounded-lg p-2 backdrop-blur-sm">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-xs font-medium">Detailed Report</span>
                  </div>
                </div>

                {/* CTA Buttons with poster-style design */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in slide-in-from-bottom-4 duration-700 delay-800">
                  <Button
                    onClick={handleGetFreeTest}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 font-bold py-2 px-6 rounded-full text-sm transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-white border-opacity-30 uppercase tracking-wide"
                  >
                    Get FREE Test Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border-2 border-gray-500 hover:border-gray-400 font-semibold py-2 px-6 rounded-full text-sm transition-all duration-300 backdrop-blur-md shadow-xl uppercase tracking-wide transform hover:scale-105"
                  >
                    Maybe Later
                  </Button>
                </div>

                {/* Company Branding with poster-style */}
                <div className="mt-6 animate-in slide-in-from-bottom-4 duration-700 delay-1000">
                  <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-xl p-3 border border-white border-opacity-20">
                    <p className="text-sm text-yellow-200 font-bold mb-1 tracking-wide">
                      🏆 TRUSTED ACROSS KENYA
                    </p>
                    <p className="text-lg font-black text-white tracking-wider text-shadow-lg">
                      AFRENSICS SECURITY LTD
                    </p>
                    <p className="text-xs text-gray-200 mt-1 font-medium">
                      Your Cybersecurity Partner in Kenya
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {popupVariants.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenetrationTestingPopup;
