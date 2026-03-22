
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
  Shield,
  Brain,
  Sparkles,
} from 'lucide-react';

import aediLogo from '@/assets/favicon_logo/aedi.png';
import LanguageSelector from '@/components/LanguageSelector';
import WhatsAppButton from '@/components/WhatsAppButton';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [breachMenuOpen, setBreachMenuOpen] = useState(false);
  const [desktopBreachOpen, setDesktopBreachOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: 'BiloHub AI', href: '/bilohub-ai', badge: 'NEW' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  
  return (
    <>
      {/* Top Info Bar with Blue/Cyan Theme */}
      <div className="bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-900 text-white text-sm py-2 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background line */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(6,182,212,0.1),transparent)] animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-y-2 relative z-10">
          <div className="flex items-center gap-x-4 flex-wrap">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-cyan-300" />
              <span className="text-cyan-100">+254708759251</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4 text-cyan-300" />
              <span className="text-cyan-100">info@aedisecurity.com</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-cyan-300" />
              <span className="text-cyan-100 hidden md:inline">1st floor, Park Place, 2nd Avenue</span>
              <span className="text-cyan-100 md:hidden">Nairobi, Kenya</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/Afrensics/" target="_blank" rel="noopener noreferrer" className="text-cyan-200 hover:text-white transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://x.com/afrensics" target="_blank" rel="noopener noreferrer" className="text-cyan-200 hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <WhatsAppButton
              size="sm"
              variant="icon"
              className="text-cyan-200 hover:text-green-400"
              phoneNumber="254743141928"
              message="Hi! I'm interested in AEDI Security's AI and cybersecurity services. Can you help me?"
            />
            <a href="https://www.linkedin.com/company/aedisecurity/" target="_blank" rel="noopener noreferrer" className="text-cyan-200 hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/afrensics/" target="_blank" rel="noopener noreferrer" className="text-cyan-200 hover:text-white transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.youtube.com/@afrensicsSecurity" target="_blank" rel="noopener noreferrer" className="text-cyan-200 hover:text-white transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar with Glass Effect */}
      <nav className="mt-2 bg-background/80 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-50 shadow-lg">
        <style>{`
          .nav-link {
            position: relative;
          }
          .nav-link::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #06b6d4, #2dd4bf);
            transition: width 0.3s ease;
          }
          .nav-link:hover::after {
            width: 100%;
          }
          .nav-link:hover {
            color: #22d3ee;
          }
          .logo-glow {
            filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.5));
          }
        `}</style>

        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between h-auto md:h-16">
             <div className="flex items-center min-w-0 flex-shrink-0">
               <Link to="/" className="flex items-center flex-shrink-0 relative z-[70] group">
                 <div className="relative">
                   <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                   <img src={aediLogo} alt="Logo" className="h-14 w-14 mr-3 relative logo-glow" />
                 </div>
                 <div className="flex flex-col">
                   <span className="font-bold text-lg sm:text-xl text-foreground tracking-tight">AFRENSICS</span>
                   <span className="text-xs text-cyan-600 -mt-1">SOLUTIONS</span>
                 </div>
                 {/* Tech badges - Blue/Cyan theme */}
                 <div className="ml-3 hidden lg:flex items-center gap-2">
                   <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                     <Brain className="w-3 h-3 text-cyan-500" />
                     <span className="text-[10px] text-cyan-600 font-medium">AI</span>
                   </div>
                   <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
                     <Shield className="w-3 h-3 text-teal-500" />
                     <span className="text-[10px] text-teal-600 font-medium">CYBERSEC</span>
                   </div>
                 </div>
               </Link>
             </div>

             {/* Desktop Navigation */}
             <div className="hidden md:block">
               <div className="ml-4 flex items-center space-x-1 whitespace-nowrap">
                 {navItems.map((item) => (
                   <Link
                     key={item.name}
                     to={item.href}
                     className="nav-link text-muted-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                   >
                     {item.name}
                     {item.badge && (
                       <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold">
                         {item.badge}
                       </span>
                     )}
                   </Link>
                 ))}
                 {/* Check Breach Dropdown (Desktop) */}
                 <div
                   className="relative"
                   onMouseEnter={() => setDesktopBreachOpen(true)}
                   onMouseLeave={() => setDesktopBreachOpen(false)}
                 >
                   <button
                     className="nav-link text-muted-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                     aria-haspopup="menu"
                     aria-expanded={desktopBreachOpen}
                   >
                     {t('nav.checkBreach')}
                     <svg className={`w-4 h-4 transition-transform ${desktopBreachOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                   </button>
                   <div
                     className={`${desktopBreachOpen ? 'block opacity-100' : 'hidden opacity-0'} transition-all duration-150 absolute left-0 top-full w-56 z-20 rounded-lg shadow-lg bg-background/95 backdrop-blur-md border border-cyan-500/20`}
                     role="menu"
                   >
                     <div className="py-1">
                       <Link
                         to="/check-breach"
                         className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-cyan-500/10 hover:text-cyan-600 transition-colors"
                         role="menuitem"
                       >
                         <Shield className="w-4 h-4 text-cyan-500" />
                         Email Breach Checker
                       </Link>
                       <Link
                         to="/check-breach/malware-scanner"
                         className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-cyan-500/10 hover:text-cyan-600 transition-colors"
                         role="menuitem"
                       >
                         <Shield className="w-4 h-4 text-teal-500" />
                         Malware & Phishing Scanner
                       </Link>
                     </div>
                   </div>
                 </div>
                 <LanguageSelector />
                 <Link to="/contact">
                   <Button variant="default" className="ml-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 border-0">
                     Get Quote
                   </Button>
                 </Link>
               </div>
             </div>

             {/* Mobile menu button */}
             <div className="md:hidden flex items-center">
               <Link to="/contact" className="mr-2">
                 <Button size="sm" className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 border-0">
                   Quote
                 </Button>
               </Link>
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
           <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-cyan-500/20">
             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               {navItems.map((item) => (
                 <Link
                   key={item.name}
                   to={item.href}
                   className="text-muted-foreground hover:text-cyan-600 hover:bg-cyan-500/10 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                   onClick={() => setIsOpen(false)}
                 >
                   {item.name}
                 </Link>
               ))}

               {/* Check Breach Dropdown (Mobile) */}
               <div className="px-3">
                 <button
                   onClick={() => setBreachMenuOpen((v) => !v)}
                   className="w-full text-left text-muted-foreground hover:text-cyan-600 hover:bg-cyan-500/10 flex items-center justify-between px-3 py-2 rounded-md text-base font-medium transition-colors"
                 >
                   {t('nav.checkBreach')}
                   <svg className={`w-4 h-4 transition-transform ${breachMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>
                 {breachMenuOpen && (
                   <div className="ml-4 mt-1 space-y-1">
                     <Link
                       to="/check-breach"
                       className="flex items-center gap-2 text-muted-foreground hover:text-cyan-600 hover:bg-cyan-500/10 block px-3 py-2 rounded-md text-sm"
                       onClick={() => setIsOpen(false)}
                     >
                       <Shield className="w-4 h-4" />
                       Email Breach Checker
                     </Link>
                     <Link
                       to="/check-breach/malware-scanner"
                       className="flex items-center gap-2 text-muted-foreground hover:text-cyan-600 hover:bg-cyan-500/10 block px-3 py-2 rounded-md text-sm"
                       onClick={() => setIsOpen(false)}
                     >
                       <Shield className="w-4 h-4" />
                       Malware & Phishing Scanner
                     </Link>
                   </div>
                 )}
               </div>

               <div className="px-3 py-2 space-y-2 border-t border-cyan-500/20 mt-2">
                 <div className="flex gap-2">
                   <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-600">
                     <Brain className="w-3 h-3" />
                     AI Services
                   </div>
                   <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs text-teal-600">
                     <Shield className="w-3 h-3" />
                     Security
                   </div>
                 </div>
                 <LanguageSelector />
               </div>
             </div>
           </div>
         )}
      </nav>
    </>
  );
};

export default Navigation;
