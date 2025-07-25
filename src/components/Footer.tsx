import aediLogo from '@/assets/favicon_logo/aedi.jpeg';
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <div
      className="text-white bg-cover bg-center relative"
      style={{ backgroundImage: "url('/src/assets/banner/footer.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-85"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img src={aediLogo} alt="Logo" className="h-8 w-8 mr-2 rounded" />
              <span className="font-bold text-xl">AEDI Security Ltd</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Professional cybersecurity firm in Kenya, providing comprehensive security solutions 
              to protect businesses from evolving digital threats.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-primary mr-2" />
                <span className="text-gray-300">info@aedisecurity.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-primary mr-2" />
                <span className="text-gray-300">+254 714 796 254</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                <span className="text-gray-300">Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/services" className="text-gray-300 hover:text-primary transition-colors">Services</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-primary transition-colors">Blog</a></li>
              <li><a href="/check-breach" className="text-gray-300 hover:text-primary transition-colors">Check Breach</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="/services#pentest" className="text-gray-300 hover:text-primary transition-colors">Penetration Testing</a></li>
              <li><a href="/services#assessment" className="text-gray-300 hover:text-primary transition-colors">Vulnerability Assessment</a></li>
              <li><a href="/services#training" className="text-gray-300 hover:text-primary transition-colors">Security Training</a></li>
              <li><a href="/services#incident" className="text-gray-300 hover:text-primary transition-colors">Incident Response</a></li>
              <li><a href="/services#cloud" className="text-gray-300 hover:text-primary transition-colors">Cloud Security</a></li>
              <li><a href="/services#mobile" className="text-gray-300 hover:text-primary transition-colors">Mobile App Development</a></li>
              <li><a href="/services#web" className="text-gray-300 hover:text-primary transition-colors">Custom Web Applications</a></li>
              <li><a href="/services#ai" className="text-gray-300 hover:text-primary transition-colors">AI & Machine Learning Solutions</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 AEDI Security Ltd. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://x.com/afrensics" className="text-gray-300 hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/company/aedisecurity/" className="text-gray-300 hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://www.facebook.com/Afrensics/" className="text-gray-300 hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
