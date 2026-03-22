import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Search, Users, AlertTriangle, Cloud, GraduationCap, Brain, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <Brain className="h-8 w-8 text-primary" />,
    title: "BiloHub AI",
    description: "Revolutionary AI solutions for African businesses. Smart automation, predictive analytics, and intelligent agents."
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Penetration Testing",
    description: "Comprehensive security testing to identify vulnerabilities in your systems."
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Vulnerability Assessment",
    description: "Automated and manual assessment of your infrastructure's security posture."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Social Engineering Testing",
    description: "Test your team's awareness against phishing and social engineering attacks."
  },
  {
    icon: <AlertTriangle className="h-8 w-8 text-primary" />,
    title: "Incident Response",
    description: "24/7 incident response and recovery services to minimize breach impact."
  },
  {
    icon: <Cloud className="h-8 w-8 text-primary" />,
    title: "Cloud Security Assessment",
    description: "Secure your cloud infrastructure with comprehensive security audits."
  },
  {
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    title: "Security Training",
    description: "Cybersecurity awareness training to empower your workforce."
  }
];

const ServicesPreview = () => {
  return (
    <section className="py-16 bg-cyber-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI & Cybersecurity Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge AI solutions and comprehensive cybersecurity to protect and empower your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link to="/contact" key={index}>
              <Card className="card-gradient shadow-card hover:shadow-hero transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-sm text-primary font-medium">Click to inquire</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/services">
            <Button size="lg" className="primary-gradient text-white px-8 py-3">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;