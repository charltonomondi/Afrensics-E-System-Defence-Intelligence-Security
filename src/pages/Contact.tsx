import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { useTranslation } from 'react-i18next';
import { emailjsConfig, validateFormData, EmailTemplateParams } from '@/config/emailjs';
import contactBanner from '@/assets/banner/contact.jpeg';
import {
  sanitizeHtml,
  validateEmail,
  validatePhone,
  contactFormLimiter,
  securityLogger
} from '@/utils/security';

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    const clientId = `${navigator.userAgent}_${window.location.hostname}`;
    if (!contactFormLimiter.canMakeRequest(clientId)) {
      securityLogger.logRateLimitExceeded(clientId);
      toast({
        title: "Too Many Requests",
        description: "Please wait a few minutes before submitting another message.",
        variant: "destructive",
        duration: 7000,
      });
      return;
    }

    // Sanitize form data
    const sanitizedData = {
      name: sanitizeHtml(formData.name.trim()),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      company: sanitizeHtml(formData.company.trim()),
      message: sanitizeHtml(formData.message.trim())
    };

    // Enhanced validation with security checks
    if (!sanitizedData.name || sanitizedData.name.length < 2) {
      securityLogger.logFailedValidation('name', formData.name, 'too_short');
      toast({
        title: "Invalid Name",
        description: "Name must be at least 2 characters long.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    if (!validateEmail(sanitizedData.email)) {
      securityLogger.logFailedValidation('email', formData.email, 'invalid_format');
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    if (sanitizedData.phone && !validatePhone(sanitizedData.phone)) {
      securityLogger.logFailedValidation('phone', formData.phone, 'invalid_format');
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    if (!sanitizedData.message || sanitizedData.message.length < 10) {
      securityLogger.logFailedValidation('message', formData.message, 'too_short');
      toast({
        title: "Invalid Message",
        description: "Message must be at least 10 characters long.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Additional security validation
    const validationErrors = validateFormData(sanitizedData);
    if (validationErrors.length > 0) {
      securityLogger.logFailedValidation('general', JSON.stringify(formData), validationErrors[0]);
      toast({
        title: "Validation Error",
        description: validationErrors[0],
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Initialize EmailJS
      emailjs.init(emailjsConfig.publicKey);

      // Prepare email template parameters with sanitized data
      const templateParams: EmailTemplateParams = {
        from_name: sanitizedData.name,
        from_email: sanitizedData.email,
        phone: sanitizedData.phone || 'Not provided',
        company: sanitizedData.company || 'Not provided',
        message: sanitizedData.message,
        to_email: emailjsConfig.recipientEmail,
      };

      // Send email using EmailJS
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        templateParams,
        emailjsConfig.publicKey
      );

      // Success notification with delayed form reset
      toast({
        title: emailjsConfig.messages.success.title,
        description: emailjsConfig.messages.success.description,
        variant: "default",
        duration: 5000, // Show toast for 5 seconds
      });

      // Set resetting state and reset form after toast disappears
      setIsResetting(true);
      setTimeout(() => {
        resetForm();
        setIsResetting(false);
      }, 5500);
    } catch (error) {
      console.error('EmailJS error:', error);

      // Error notification (don't reset form so user can try again)
      toast({
        title: emailjsConfig.messages.error.title,
        description: emailjsConfig.messages.error.description,
        variant: "destructive",
        duration: 7000, // Show error toast for 7 seconds (longer for error messages)
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Contact AEDI Security | Get Cybersecurity Consultation | Kenya"
        description="Contact AEDI Security Ltd for professional cybersecurity services in Kenya. Get expert consultation on penetration testing, vulnerability assessment, incident response, and security solutions."
        keywords="Contact AEDI Security, Cybersecurity Consultation Kenya, Security Services Contact, Penetration Testing Quote, Incident Response Contact, Cybersecurity Help Kenya, AEDI Contact, Afrensics Contact"
        url="https://aedisecurity.com/contact"
      />
      <Navigation />

      {/* Hero Section */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${contactBanner})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to secure your business? Get in touch with our cybersecurity experts.
            We're here to help protect your digital assets.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <Card className="card-gradient shadow-hero">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Send className="h-6 w-6 text-primary mr-2" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className={`space-y-6 transition-opacity duration-300 ${isResetting ? 'opacity-60' : 'opacity-100'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        {t('contact.form.name')} *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        {t('contact.form.email')} *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        {t('contact.form.phone')}
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        {t('contact.form.company')}
                      </label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      {t('contact.form.message')} *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your cybersecurity needs..."
                      rows={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full primary-gradient text-white"
                    disabled={isSubmitting || isResetting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : isResetting ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Message Sent! Clearing form...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {t('contact.form.send')}
                      </>
                    )}
                  </Button>
                </form>

                {/* Reset notification */}
                {isResetting && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Message sent successfully! Form will clear in a moment...</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="card-gradient shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Get in Touch</CardTitle>
                <CardDescription>
                  Multiple ways to reach our cybersecurity experts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Address</h3>
                    <p className="text-muted-foreground">
                      1st floor, Park Place, 2nd Avenue<br />
                      Parklands off Limuru Road<br />
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone Numbers</h3>
                    <p className="text-muted-foreground">
                      Main: 254 714 796 254<br />
                      Emergency: +254 743 141 928<br />
                      <span className="text-primary font-medium">Available 24/7</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email Addresses</h3>
                    <p className="text-muted-foreground">
                      General: info@aedisecurity.com<br />
                      Support: charlton_omondi@aedisecurity.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Emergency calls only<br />
                      <span className="text-primary font-medium">24/7 Emergency Support Available</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="w-full mt-16">
            <h2 className="text-2xl font-bold text-center mb-4">Find Our Office</h2>
            <div className="w-full h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5025.634092892529!2d36.81989077720169!3d-1.263233300824516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17003e0581e3%3A0xdf7b39f091042630!2sPark%20Place%20Building!5e0!3m2!1sen!2snl!4v1753377791030!5m2!1sen!2snl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AEDI Security Office Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-cyber-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-gradient shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">How quickly can you respond to security incidents?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We provide 24/7 emergency response with initial contact within 1 hour
                  and on-site response within 4 hours for critical incidents.
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Do you provide services outside Nairobi?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we serve clients across Kenya and East Africa. Remote services
                  are available globally, with on-site services in major cities.
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">What certifications do your team members hold?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our team holds certifications including CISSP, CEH, CISA, CISM,
                  and other industry-standard cybersecurity qualifications.
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Do you offer payment plans for services?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we offer flexible payment options including monthly retainers,
                  project-based billing, and custom payment plans for enterprise clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Secure Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Don't wait for a cyber attack. Contact us today for a free security consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/check-breach">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Free Security Assessment
              </Button>
            </Link>
            <a href="tel:+254714796254">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-cyber-dark px-8 py-3"
              >
                Call Now: +254 714 796 254
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton
        variant="floating"
        size="lg"
        phoneNumber="254743141928"
        message="Hi! I need help with cybersecurity services. Can we discuss my requirements?"
      />
    </div>
  );
};

export default Contact;
