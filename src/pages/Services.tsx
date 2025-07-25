import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Search, Users, AlertTriangle, Cloud, GraduationCap, Database, Settings, FileText, Monitor, Lock, UserCheck, Smartphone, Code, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <Shield className="h-12 w-12 text-primary" />,
    title: "Penetration Testing",
    description: "Comprehensive security testing including web applications, networks, and mobile applications to identify vulnerabilities before attackers do.",
    features: ["Web Application Testing", "Network Penetration", "Mobile App Security", "Social Engineering", "Wireless Security"],
    startingPrice: "$2,000",
    popular: true
  },
  {
    icon: <Search className="h-12 w-12 text-primary" />,
    title: "Vulnerability Assessment",
    description: "Automated and manual assessment of your infrastructure to identify security weaknesses and compliance gaps.",
    features: ["Automated Scanning", "Manual Verification", "Risk Prioritization", "Compliance Mapping", "Remediation Guidance"],
    startingPrice: "$1,500",
    popular: false
  },
  {
    icon: <Users className="h-12 w-12 text-primary" />,
    title: "Social Engineering Testing",
    description: "Test your team's awareness against phishing, vishing, and physical security threats through controlled simulations.",
    features: ["Phishing Campaigns", "Phone-based Testing", "Physical Infiltration", "Awareness Training", "Custom Scenarios"],
    startingPrice: "$1,000",
    popular: false
  },
  {
    icon: <Database className="h-12 w-12 text-primary" />,
    title: "Data Protection Audit",
    description: "Comprehensive audit to ensure compliance with DPA 2019, GDPR, and other data protection regulations.",
    features: ["GDPR Compliance", "DPA 2019 Audit", "Data Mapping", "Privacy Impact Assessment", "Policy Development"],
    startingPrice: "$3,000",
    popular: false
  },
  {
    icon: <Cloud className="h-12 w-12 text-primary" />,
    title: "Cloud Security Assessment",
    description: "Secure your cloud infrastructure with comprehensive security audits for AWS, Azure, and Google Cloud.",
    features: ["Multi-Cloud Support", "Configuration Review", "Access Controls", "Data Encryption", "Monitoring Setup"],
    startingPrice: "$2,500",
    popular: true
  },
  {
    icon: <GraduationCap className="h-12 w-12 text-primary" />,
    title: "Cybersecurity Training",
    description: "Comprehensive training programs to build security awareness and technical skills across your organization.",
    features: ["Security Awareness", "Technical Training", "Phishing Simulation", "Custom Curricula", "Certification Prep"],
    startingPrice: "$500",
    popular: false
  },
  {
    icon: <Settings className="h-12 w-12 text-primary" />,
    title: "Risk Management",
    description: "Strategic cybersecurity risk assessment and management consulting to align security with business objectives.",
    features: ["Risk Assessment", "Business Alignment", "Control Framework", "Metrics & KPIs", "Executive Reporting"],
    startingPrice: "$4,000",
    popular: false
  },
  {
    icon: <AlertTriangle className="h-12 w-12 text-primary" />,
    title: "Incident Response",
    description: "24/7 incident response services to minimize breach impact and ensure rapid recovery from security incidents.",
    features: ["24/7 Response", "Forensic Analysis", "Containment", "Recovery Planning", "Legal Support"],
    startingPrice: "$5,000",
    popular: true
  },
  {
    icon: <FileText className="h-12 w-12 text-primary" />,
    title: "Security Policy Review",
    description: "Comprehensive review and development of security policies, procedures, and governance frameworks.",
    features: ["Policy Development", "Compliance Mapping", "Gap Analysis", "Implementation Guide", "Regular Updates"],
    startingPrice: "$2,000",
    popular: false
  },
  {
    icon: <Monitor className="h-12 w-12 text-primary" />,
    title: "Security Architecture Review",
    description: "Evaluate and enhance your security architecture to ensure robust protection against evolving threats.",
    features: ["Architecture Assessment", "Design Review", "Technology Evaluation", "Implementation Planning", "Best Practices"],
    startingPrice: "$3,500",
    popular: false
  },
  {
    icon: <Lock className="h-12 w-12 text-primary" />,
    title: "Managed Security Services",
    description: "Comprehensive managed security services including SIEM, threat hunting, and continuous monitoring.",
    features: ["24/7 Monitoring", "Threat Detection", "SIEM Management", "Threat Hunting", "Compliance Reporting"],
    startingPrice: "$8,000/month",
    popular: true
  },
  {
    icon: <UserCheck className="h-12 w-12 text-primary" />,
    title: "Security Readiness Assessment",
    description: "Comprehensive evaluation of your organization's security posture and incident response capabilities.",
    features: ["Readiness Testing", "Gap Analysis", "Playbook Review", "Team Assessment", "Improvement Plan"],
    startingPrice: "$2,500",
    popular: false
  },
  {
    icon: <Smartphone className="h-12 w-12 text-primary" />,
    title: "Mobile App Development",
    description: "Secure mobile applications with built-in cybersecurity features and robust data protection.",
    features: ["iOS & Android Development", "Security-First Architecture", "API Integration", "Real-time Monitoring", "Compliance Ready"],
    startingPrice: "$10,000",
    popular: true
  },
  {
    icon: <Code className="h-12 w-12 text-primary" />,
    title: "Custom Web Development",
    description: "Secure web applications and platforms tailored to your business needs with modern frameworks.",
    features: ["Secure Coding Practices", "Modern Frameworks", "Scalable Architecture", "Performance Optimization", "Security Integration"],
    startingPrice: "$8,000",
    popular: false
  },
  {
    icon: <Brain className="h-12 w-12 text-primary" />,
    title: "AI & Machine Learning Solutions",
    description: "Intelligent security solutions powered by artificial intelligence and machine learning algorithms.",
    features: ["Threat Detection AI", "Predictive Analytics", "Custom ML Models", "Automated Response", "Advanced Analytics"],
    startingPrice: "$15,000",
    popular: true
  }
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('/src/assets/banner/services.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            CyberDev
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We deliver end-to-end software solutions and robust cybersecurity services tailored to meet your business needs.
            From custom applications to advanced threat protection, AEDI Security ensures your digital presence is powerful, secure, and future-ready.
          </p>
        </div>
      </section>


      {/* Services Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className={`relative card-gradient shadow-card hover:shadow-hero transition-all duration-300 hover:-translate-y-1 ${service.popular ? 'ring-2 ring-primary' : ''}`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">{service.icon}</div>
                  <CardTitle className="text-xl font-semibold mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground mb-4">
                    {service.description}
                  </CardDescription>
                  <div className="text-3xl font-bold text-primary mb-4">{service.startingPrice}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <Shield className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact">
                    <Button className="w-full primary-gradient text-white">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-cyber-light">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Need a Custom Security Solution?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our experts can design a tailored cybersecurity program that fits your specific requirements and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="primary-gradient text-white px-8 py-3">
                Request Custom Quote
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Schedule Consultation
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

export default Services;