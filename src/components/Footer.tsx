import aediLogo from '@/assets/favicon_logo/aedi.jpeg';
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import WhatsAppButton from '@/components/WhatsAppButton';
import footerBanner from '@/assets/banner/footer.jpg';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div
      className="text-white bg-cover bg-center relative"
      style={{ backgroundImage: `url(${footerBanner})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-85"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <img src={aediLogo} alt="Logo" className="h-8 w-8 mr-2 rounded flex-shrink-0" />
              <span className="font-bold text-lg sm:text-xl">AEDI Security Ltd</span>
            </div>
            <p className="text-gray-300 mb-6 text-sm sm:text-base max-w-md">
              {t('footer.description')}
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="h-4 w-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base break-all">info@aedisecurity.com</span>
              </div>
              <div className="flex items-start">
                <Phone className="h-4 w-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">+254708759251</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  1st floor, Park Place, 2nd Avenue Parklands off Limuru Road Nairobi, Kenya
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 sm:mt-0">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="/services" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">Services</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">About Us</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">Blog</a></li>
              <li><a href="/check-breach" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">Check Breach</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="mt-8 sm:mt-0">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2">
              <li><a href="/services#pentest" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">Penetration Testing</a></li>
              <li><a href="/services#assessment" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">Vulnerability Assessment</a></li>
              <li><a href="/services#training" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">Security Training</a></li>
              <li><a href="/services#incident" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">Incident Response</a></li>
              <li><a href="/services#cloud" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">Cloud Security</a></li>
              <li><a href="/services#mobile" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">Mobile App Development</a></li>
              <li><a href="/services#web" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">Custom Web Applications</a></li>
              <li><a href="/services#ai" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">AI & Machine Learning Solutions</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-300 text-xs sm:text-sm text-center sm:text-left">
            © 2024 AEDI Security Ltd. {t('footer.rights')}
          </p>
          <div className="flex space-x-3 sm:space-x-4">
            <a href="https://x.com/afrensics" className="text-gray-300 hover:text-primary transition-colors p-1">
              <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <WhatsAppButton
              size="sm"
              variant="icon"
              className="text-gray-300 hover:text-green-400 p-1"
              phoneNumber="254743141928"
              message="Hi! I'm interested in AEDI Security's cybersecurity services. Can you help me?"
            />

            <a href="https://www.linkedin.com/company/aedisecurity/" className="text-gray-300 hover:text-primary transition-colors p-1">
              <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <a href="https://www.facebook.com/Afrensics/" className="text-gray-300 hover:text-primary transition-colors p-1">
              <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <a href="https://www.youtube.com/@afrensicsSecurity" className="text-gray-300 hover:text-primary transition-colors p-1">
              <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
