import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // In real implementation, this would send to backend/Supabase
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('/src/assets/banner/contact.jpeg')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Contact Us
          </h1>
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
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
                        Email Address *
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
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
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
                  
                  <Button type="submit" size="lg" className="w-full primary-gradient text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information & Map */}
            <div className="space-y-8">
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
                        Sales: sales@aedisecurity.com<br />
                        Support: support@aedisecurity.com
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

              
              {/* Google Map */}
              <Card className="card-gradient shadow-card overflow-hidden">
                <CardHeader>
                  <CardTitle>Find Our Office</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full h-64 bg-cyber-light flex items-center justify-center">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5025.634092892529!2d36.81989077720169!3d-1.263233300824516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17003e0581e3%3A0xdf7b39f091042630!2sPark%20Place%20Building!5e0!3m2!1sen!2snl!4v1753377791030!5m2!1sen!2snl"
                      width="100%"
                      height="256"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="AEDI Security Office Location"
                    />
                  </div>
                </CardContent>
              </Card>
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
            <a href="tel:+254 714 796 254">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cyber-dark px-8 py-3">
                Call Now: +254 714 796 254
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Contact;