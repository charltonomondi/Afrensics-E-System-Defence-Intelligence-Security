import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, Search, AlertTriangle, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import happyHolidaysImg from '@/assets/happyholidays.jpg';

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
    },
    {
      image: happyHolidaysImg,
      title: "Happy Holidays",
      subtitle: "Season's Greetings from AEDI Security",
      description: "Wishing you a joyful holiday season and a secure new year. Stay safe and protected with our cybersecurity services!",
      icon: <Heart className="w-8 h-8 text-red-500" />,
      gradient: "from-red-600 to-green-600"
    }
  ];

  const currentVariant = popupVariants[currentImageIndex];

  // RFQ form state and visibility
  const [showRFQ, setShowRFQ] = useState(false);
  const RFQ_DELAY = 8000; // time after popup shows to open RFQ if not closed
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const updateField = (
    field: keyof typeof form
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleRFQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Request for Quotation - ${form.service || 'AEDI Security'}`;

    const rows: Array<[string, string]> = [
      ['Name', form.name || '-'],
      ['Company', form.company || '-'],
      ['Email', form.email || '-'],
      ['Phone', form.phone || '-'],
      ['Service', form.service || '-'],
      ['Message', form.message || '-'],
    ];

    // Markdown-style table for wide client compatibility
    const table = [
      '| Field | Value |',
      '|-------|-------|',
      ...rows.map(([f, v]) => `| ${f} | ${v} |`),
    ].join('\n');

    const body = `RFQ Submission\n\n${table}\n\n--\nSent from AEDI Security website`;
    const mailto = `mailto:info@aedisecurity.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

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

  // If popup remains open for a while, show RFQ dialog centered
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => {
        const el = document.activeElement as HTMLElement | null;
        const typing = !!(
          el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)
        );
        if (!typing) {
          setShowRFQ(true);
        }
      }, RFQ_DELAY);
      return () => clearTimeout(t);
    } else {
      setShowRFQ(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGetFreeTest = () => {
    window.location.href = '/contact?service=penetration-testing';
    onClose();
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <div
          className="relative w-[320px] sm:w-[360px] max-h-[420px] overflow-hidden rounded-xl shadow-2xl border border-white/20 animate-in slide-in-from-right-4 duration-500 pointer-events-auto"
          role="dialog"
          aria-label="Penetration testing promotion"
        >
          {/* Background Image with Overlay */}
          <div className="relative h-full min-h-[280px]">
            <img
              src={currentVariant.image}
              alt="Penetration Testing"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 filter brightness-75"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${currentVariant.title === "Happy Holidays" ? currentVariant.gradient : "from-cyan-500 via-teal-500 to-blue-700"} opacity-85`}></div>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-2 right-2 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/40 shadow-md cursor-pointer"
              title="Close popup"
              aria-label="Close popup"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Content */}
            <div className="relative z-10 h-full flex items-end">
              <div className="w-full px-4 py-4 text-white">
                <div className="text-center">
                  <div className="mx-auto mb-2 w-10 h-10 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                    {currentVariant.icon}
                  </div>

                  <h2 className="text-xl font-extrabold mb-1 tracking-tight text-shadow-md">
                    {currentVariant.title}
                  </h2>
                  <h3 className="text-sm font-semibold mb-2 text-yellow-200">
                    {currentVariant.subtitle}
                  </h3>
                  <p className="text-xs mb-3 text-gray-50 leading-relaxed">
                    {currentVariant.description}
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    <div className="flex items-center justify-center space-x-1 bg-white/10 rounded-md p-1.5 backdrop-blur-sm">
                      <CheckCircle className="w-3 h-3 text-green-300" />
                      <span className="text-[10px] font-medium">Free</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1 bg-white/10 rounded-md p-1.5 backdrop-blur-sm">
                      <CheckCircle className="w-3 h-3 text-green-300" />
                      <span className="text-[10px] font-medium">Experts</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1 bg-white/10 rounded-md p-1.5 backdrop-blur-sm">
                      <CheckCircle className="w-3 h-3 text-green-300" />
                      <span className="text-[10px] font-medium">Report</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={handleGetFreeTest}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 font-bold py-1.5 px-3 rounded-full text-xs transition-all duration-300 shadow-lg border border-white/30"
                    >
                      Get FREE Test
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="bg-black/40 hover:bg-black/50 text-white border-white/40 font-semibold py-1.5 px-3 rounded-full text-xs transition-all duration-300"
                    >
                      Later
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
              {popupVariants.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RFQ Dialog */}
      <Dialog open={showRFQ} onOpenChange={setShowRFQ}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request for Quotation</DialogTitle>
            <DialogDescription>
              Provide your details and we’ll prepare a quotation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRFQSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={updateField('name')} placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={form.company} onChange={updateField('company')} placeholder="Company Ltd" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={updateField('email')} placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={updateField('phone')} placeholder="+2547..." />
              </div>
            </div>
            <div>
              <Label htmlFor="service">Service Needed</Label>
              <Input id="service" value={form.service} onChange={updateField('service')} placeholder="e.g., Penetration Testing" />
            </div>
            <div>
              <Label htmlFor="message">Additional Details</Label>
              <Textarea id="message" value={form.message} onChange={updateField('message')} placeholder="Describe your requirements, scope, timelines, etc." />
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PenetrationTestingPopup;
