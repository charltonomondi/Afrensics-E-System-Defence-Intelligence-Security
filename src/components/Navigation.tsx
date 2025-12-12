
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  TreePine,
} from 'lucide-react';

import aediLogo from '@/assets/favicon_logo/aedi.png';
import LanguageSelector from '@/components/LanguageSelector';
import WhatsAppButton from '@/components/WhatsAppButton';
import christmasImg from '@/assets/christmas.jpg';
import hh1 from '@/assets/hh1.jpeg';
import hh2 from '@/assets/hh2.webp';
import hh3 from '@/assets/hh3.webp';
import hh4 from '@/assets/hh4.webp';
import hh5 from '@/assets/hh5.jpg';
import hh6 from '@/assets/hh6.jpeg';
import xmassImg from '@/assets/xmass.jpg';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [breachMenuOpen, setBreachMenuOpen] = useState(false);
  const [desktopBreachOpen, setDesktopBreachOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const [showSeasonal] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [fade, setFade] = useState(false);

  // Rotate festive images with crossfade effect
  const festiveImages = [christmasImg, hh1, hh2, hh3, hh4, hh5, hh6];
  const nextIndex = (i: number) => (i + 1) % festiveImages.length;

  // Cycle every 5s with crossfade
  // Using requestAnimationFrame-safe setInterval cadence
  // Keep animation lightweight to not affect navbar interactions
  useEffect(() => {
    const interval = window.setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setImgIndex((i) => nextIndex(i));
        setFade(false);
      }, 800);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  
  return (
    <>
      {/* Top Info Bar */}
<div className="bg-cyan-600 text-white text-sm py-2 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-y-2">
    <div className="flex items-center gap-x-4 flex-wrap">
      <div className="flex items-center gap-1">
        <Phone className="w-4 h-4" />
        <span>+254708759251</span>
      </div>
      <div className="flex items-center gap-1">
        <Mail className="w-4 h-4" />
        <span>info@aedisecurity.com</span>
      </div>
      <div className="flex items-center gap-1">
        <MapPin className="w-4 h-4" />
              <span>1st floor, Park Place, 2nd Avenue
                Parklands off Limuru Road
                Nairobi, Kenya</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <a href="https://www.facebook.com/Afrensics/" target="_blank" rel="noopener noreferrer">
        <Facebook className="w-4 h-4 text-white hover:text-gray-300" />
      </a>
      <a href="https://x.com/afrensics" target="_blank" rel="noopener noreferrer">
        <Twitter className="w-4 h-4 text-white hover:text-gray-300" />
      </a>
      <WhatsAppButton
        size="sm"
        variant="icon"
        className="text-white hover:text-green-400"
        phoneNumber="254743141928"
        message="Hi! I'm interested in AEDI Security's cybersecurity services. Can you help me?"
      />
      <a href="https://www.linkedin.com/company/aedisecurity/" target="_blank" rel="noopener noreferrer">
        <Linkedin className="w-4 h-4 text-white hover:text-gray-300" />
      </a>
      <a href="https://www.instagram.com/afrensics/" target="_blank" rel="noopener noreferrer">
        <Instagram className="w-4 h-4 text-white hover:text-gray-300" />
      </a>
      <a href="https://www.youtube.com/@afrensicsSecurity" target="_blank" rel="noopener noreferrer">
        <Youtube className="w-4 h-4 text-white hover:text-gray-300" />
      </a>
    </div>
  </div>
</div>

{/* Main Navigation Bar */}
<nav className="mt-2 bg-background/95 backdrop-blur-sm border-y border-border sticky top-0 z-50 shadow-sm relative overflow-visible">

        <style>
          {`
            .seasonal-trapezium {
              width: 260px;
              height: calc(4rem + 30px);
              clip-path: polygon(0 0, 100% 0, 78% 100%, 0% 100%);
            }
            .seasonal-trapezium-mobile {
              width: 280px;
              height: calc(6rem + 50px);
              clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
              position: absolute;
              top: 35px;
              left: 50%;
              transform: translateX(-45%);
              z-index: 10;
            }
            @media (max-width: 640px) {
              .seasonal-trapezium-mobile {
                width: 240px;
                height: calc(4rem + 30px);
                clip-path: polygon(0 0, 100% 0, 88% 100%, 0% 100%);
              }
            }
            @media (max-width: 480px) {
              .seasonal-trapezium-mobile {
                width: 200px;
                height: calc(3rem + 20px);
                clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);
              }
            }
            @media (min-width: 768px) {
              .seasonal-trapezium-mobile {
                position: absolute;
                left: 100px;
                top: 0;
                width: 320px;
                height: calc(5rem + 40px);
                clip-path: polygon(0 0, 100% 0, 78% 100%, 0% 100%);
                margin-top: 0;
              }
            }
            @media (max-width: 768px) {
              .seasonal-trapezium {
                width: 190px;
                height: calc(3.75rem + 24px);
                clip-path: polygon(0 0, 100% 0, 84% 100%, 0% 100%);
              }
            }
            @media (max-width: 640px) {
              .seasonal-trapezium {
                width: 110px;
                height: calc(3.25rem + 18px);
                clip-path: polygon(0 0, 100% 0, 92% 100%, 0% 100%);
              }
            }
            .tree-blow {
              animation: tree-blow 3s infinite;
            }
            @keyframes tree-blow {
              0% { filter: brightness(1) drop-shadow(0 0 10px rgba(255,215,0,0.5)); transform: rotate(0deg) scale(1); }
              25% { filter: brightness(1.2) drop-shadow(0 0 15px rgba(255,0,0,0.7)); transform: rotate(-5deg) scale(1.05); }
              50% { filter: brightness(1.2) drop-shadow(0 0 15px rgba(0,255,0,0.7)); transform: rotate(5deg) scale(1.05); }
              75% { filter: brightness(1.2) drop-shadow(0 0 15px rgba(0,0,255,0.7)); transform: rotate(-3deg) scale(1.05); }
              100% { filter: brightness(1) drop-shadow(0 0 10px rgba(255,215,0,0.5)); transform: rotate(0deg) scale(1); }
            }
          `}
        </style>

        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between h-auto md:h-16">
             <div className="flex items-center min-w-0 flex-shrink-0">
               <Link to="/" className="flex items-center flex-shrink-0 relative z-[70]">
                 <img src={aediLogo} alt="Logo" className="h-16 w-16 mr-2" />
                 <span className="font-bold text-lg sm:text-xl text-foreground whitespace-nowrap">AFRENSICS SECURITY LTD</span>
                 <img src={xmassImg} alt="Christmas Tree" className="ml-2 w-12 h-12 tree-blow" />
               </Link>

               {/* Seasonal trapezium banner - positioned below logo on mobile */}
               <div
                 aria-hidden="true"
                 className={`seasonal-trapezium-mobile md:seasonal-trapezium pointer-events-none transition-all duration-300 ease-out ${showSeasonal ? 'opacity-100' : 'opacity-0'}`}
                 style={{
                   boxShadow: '0 14px 30px rgba(0,0,0,0.28)',
                   overflow: 'hidden'
                 }}
               >
                 {/* Two layers to crossfade between current and next image */}
                 <div
                   className="absolute inset-0 will-change-transform will-change-opacity"
                   style={{
                     backgroundImage: `url(${festiveImages[imgIndex]})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     transition: 'opacity 800ms ease-in-out',
                     opacity: fade ? 0 : 1
                   }}
                 />
                 <div
                   className="absolute inset-0 will-change-transform will-change-opacity"
                   style={{
                     backgroundImage: `url(${festiveImages[nextIndex(imgIndex)]})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     transition: 'opacity 800ms ease-in-out',
                     opacity: fade ? 1 : 0
                   }}
                 />
               </div>
             </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-2 whitespace-nowrap">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Check Breach Dropdown (Desktop) */}
                <div
                  className="relative"
                  onMouseEnter={() => setDesktopBreachOpen(true)}
                  onMouseLeave={() => setDesktopBreachOpen(false)}
                >
                  <button
                    className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    aria-haspopup="menu"
                    aria-expanded={desktopBreachOpen}
                  >
                    {t('nav.checkBreach')}
                  </button>
                  <div
                    className={`${desktopBreachOpen ? 'block opacity-100' : 'hidden opacity-0'} transition-opacity duration-150 absolute left-0 top-full w-56 z-20 rounded-md shadow-lg bg-background border border-border`}
                    role="menu"
                  >
                    <div className="py-1">
                      <Link
                        to="/check-breach"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                        role="menuitem"
                      >
                        Email Breach Checker
                      </Link>
                      <Link
                        to="/check-breach/malware-scanner"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                        role="menuitem"
                      >
                        Malware & Phishing Scanner
                      </Link>
                    </div>
                  </div>
                </div>
                <LanguageSelector />
                <Link to="/contact">
                  <Button variant="default" className="ml-4">
                    Get Quote
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Check Breach Dropdown (Mobile) */}
              <div className="px-3">
                <button
                  onClick={() => setBreachMenuOpen((v) => !v)}
                  className="w-full text-left text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                >
                  {t('nav.checkBreach')}
                </button>
                {breachMenuOpen && (
                  <div className="ml-4 mt-1">
                    <Link
                      to="/check-breach"
                      className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Email Breach Checker
                    </Link>
                    <Link
                      to="/check-breach/malware-scanner"
                      className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Malware & Phishing Scanner
                    </Link>
                  </div>
                )}
              </div>

              <div className="px-3 py-2 space-y-2">
                <LanguageSelector />
                <Link to="/contact">
                  <Button variant="default" className="w-full">
                    Get Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
