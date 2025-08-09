
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
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
} from 'lucide-react';

import aediLogo from '@/assets/favicon_logo/aedi.png';
import LanguageSelector from '@/components/LanguageSelector';
import WhatsAppButton from '@/components/WhatsAppButton';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.checkBreach'), href: '/check-breach' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <>
      {/* Top Info Bar */}
<div className="bg-cyan-600 text-white text-sm py-2 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-y-2">
    <div className="flex items-center gap-x-4 flex-wrap">
      <div className="flex items-center gap-1">
        <Phone className="w-4 h-4" />
        <span>+254 714 796 254</span>
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
<nav className="mt-2 bg-background/95 backdrop-blur-sm border-y border-border sticky top-0 z-50 shadow-sm">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center min-w-0 flex-shrink-0">
              <Link to="/" className="flex items-center flex-shrink-0">
                <img src={aediLogo} alt="Logo" className="h-16 w-16 mr-2" />
                <span className="font-bold text-lg sm:text-xl text-foreground whitespace-nowrap">AFRENSICS SECURITY LTD</span>
              </Link>
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
