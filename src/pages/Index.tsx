import Navigation from '@/components/Navigation';
import HeroSlider from '@/components/HeroSlider';
import ServicesPreview from '@/components/ServicesPreview';
import ClientsSection from '@/components/ClientsSection';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSlider />
      
      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Protecting Your Digital Future
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                AEDI Security Ltd is Kenya's proficient cybersecurity firm, dedicated to protecting 
                businesses from evolving digital threats. With our expert team and cutting-edge 
                solutions, we ensure your organization stays secure in an increasingly connected world.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">24/7 Security Monitoring</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Expert Penetration Testing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Compliance Auditing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Incident Response</span>
                </div>
              </div>
              <Link to="/about">
                <Button size="lg" className="primary-gradient text-white">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl font-bold text-primary">500+</CardTitle>
                  <CardDescription>Clients Protected</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl font-bold text-primary">98%</CardTitle>
                  <CardDescription>Success Rate</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl font-bold text-primary">24/7</CardTitle>
                  <CardDescription>Support Available</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl font-bold text-primary">ISO 27001</CardTitle>
                  <CardDescription>Certified</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <ServicesPreview />

      <ClientsSection />

      {/* CTA Section */}
      <section className="py-16 hero-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Secure Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get a free cybersecurity assessment and discover how we can protect your organization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Free Security Assessment
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cyber-dark px-8 py-3">
                Contact Our Experts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
