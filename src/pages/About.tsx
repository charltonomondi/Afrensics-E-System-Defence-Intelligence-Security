import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Shield, Award, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import Charlton from '@/assets/team/charlton.png';
import deo from '@/assets/team/deo-gumba.png';
import Tj from '@/assets/team/Tj.png';
import winstone from '@/assets/team/winstone.png';
import aboutBanner from '@/assets/banner/about.jpg';

const teamMembers = [
  {
    name: "Charlton O. Omondi",
    role: "Chief Executive Officer",
    description: "Certified Software Engineer and Cybersecurity Penetration Tester with hands-on expertise in Burp Suite, OWASP methodologies, and Linux-based ethical hacking tools.",
    image: Charlton,
  },
  {
    name: "Duncan E. O. Gumba",
    role: "Cybersecurity Researcher",
    description: "Well-published researcher and writer, political and security analyst, journalist and policy researcher on Africa, especially human security and criminality..",
    image: deo,
  },
  {
    name: "Tijani Tatu",
    role: "Director - ML Expert",
    description: "Software engineering, cybersecurity and certified data science & ML expert.",
    image: Tj,
  },
  {
    name: "Winstone Were",
    role: "Director - Software Engineer",
    description: "Software developer specializing in cross-platform app development using React Native.",
    image: winstone,
  }
];

const values = [
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Security First",
    description: "We prioritize security in everything we do, ensuring robust protection for our clients."
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: "Integrity",
    description: "Honest, transparent communication and ethical practices guide all our interactions."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Client Success",
    description: "Your success is our success. We're committed to delivering exceptional results."
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Excellence",
    description: "We strive for excellence in every project, maintaining the highest professional standards."
  }
];

const About = () => {
  // const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <SEO
        title="About AEDI Security | Afrensics E-System Defence & Intelligence Security Ltd"
        description="Learn about AEDI Security Ltd, Kenya's premier cybersecurity firm. Our expert team provides penetration testing, vulnerability assessment, incident response, and cybersecurity research services across East Africa."
        keywords="About AEDI Security, Afrensics E-System Defence and Intelligence Security, Cybersecurity Company Kenya, Security Team, Penetration Testing Experts, Cybersecurity Professionals, Kenya Security Firm, East Africa Cybersecurity"
        url="https://aedisecurity.com/about"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${aboutBanner})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About AEDI Security
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Proficient Software Engineers & cybersecurity experts protecting Kenya's digital landscape since 2024.
            We combine local expertise with global security standards.
          </p>
        </div>
      </section>


      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="card-gradient shadow-card">
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  To protect businesses across Africa from cyber threats through innovative 
                  security solutions, expert consulting, and continuous education.
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient shadow-card">
              <CardHeader className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  To be Africa's most trusted cybersecurity partner, enabling digital 
                  transformation while maintaining the highest security standards.
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient shadow-card">
              <CardHeader className="text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold">Our Promise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Delivering world-class cybersecurity services with personalized attention 
                  and unwavering commitment to your business success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-cyber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2024 by a team of cybersecurity professionals, AEDI Security Ltd was born 
                  from a recognition that Kenyan businesses needed access to world-class cybersecurity 
                  expertise to compete in the global digital economy.
                </p>
                <p>
                  Starting as a small consultancy, we've grown to become one of Kenya's most trusted 
                  cybersecurity firms, serving over 500 clients across East Africa. Our team combines 
                  international certifications with deep understanding of the local business environment.
                </p>
                <p>
                  Today, we continue to evolve our services to meet emerging threats, helping 
                  organizations of all sizes build resilient security postures that enable growth 
                  and innovation.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Clients Protected</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">9</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our work and define our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="card-gradient shadow-card text-center hover:shadow-hero transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <CardTitle className="text-xl font-semibold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-cyber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experienced cybersecurity professionals dedicated to protecting your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="card-gradient shadow-card hover:shadow-hero transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg font-semibold">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm text-center">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of satisfied clients who trust AEDI Security to protect their digital assets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Get Started Today
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white border-2 border-white/30 hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-700 hover:border-white/50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold shadow-xl backdrop-blur-sm relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-lg">Contact Our Team</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      {/* <WhatsAppFloat /> */}
    </div>
  );
};

export default About;