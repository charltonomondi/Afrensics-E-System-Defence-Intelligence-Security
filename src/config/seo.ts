// SEO Configuration for AEDI Security
export const seoConfig = {
  defaultTitle: "Afrensics E-System Defence & Intelligence Security Ltd | AEDI Security | Kenya's Premier Cybersecurity Firm",
  titleTemplate: "%s | AEDI Security Ltd",
  defaultDescription: "AEDI Security Ltd - Kenya's leading cybersecurity firm specializing in penetration testing, vulnerability assessment, incident response, cybersecurity research, machine learning security, and software development. Professional cybersecurity services from certified experts.",
  siteUrl: "https://aedisecurity.com",
  defaultImage: "https://aedisecurity.com/src/assets/favicon_logo/aedi.jpeg",
  twitterHandle: "@aedi_security",
  
  // Core keywords for the business
  coreKeywords: [
    "Afrensics E-System Defence and Intelligence Security",
    "AEDI Security Ltd",
    "Cybersecurity",
    "Software Development",
    "Penetration Testing",
    "Incident Response",
    "Cybersecurity Research",
    "Machine Learning",
    "Afrensics",
    "AEDI",
    "Security"
  ],
  
  // Extended cybersecurity keywords
  extendedKeywords: [
    "Vulnerability Assessment",
    "Ethical Hacking",
    "Cyber Threats",
    "Data Protection",
    "Network Security",
    "Information Security",
    "Cyber Defense",
    "Security Consulting",
    "Kenya Cybersecurity",
    "East Africa Security",
    "Digital Forensics",
    "Security Audit",
    "Compliance",
    "ISO 27001",
    "GDPR",
    "Cyber Risk Assessment",
    "Threat Intelligence",
    "Security Training",
    "Incident Management",
    "Malware Analysis",
    "Web Application Security",
    "Mobile Security",
    "Cloud Security",
    "IoT Security",
    "AI Security",
    "Blockchain Security",
    "Zero Trust",
    "SIEM",
    "SOC",
    "Endpoint Security",
    "Firewall",
    "Intrusion Detection",
    "Security Monitoring",
    "Cyber Insurance",
    "Business Continuity",
    "Disaster Recovery",
    "Nairobi Cybersecurity",
    "Kenya Security Firm",
    "African Cybersecurity",
    "Cyber Warfare",
    "Red Team",
    "Blue Team",
    "Purple Team",
    "OSINT",
    "Threat Hunting",
    "Security Architecture",
    "DevSecOps",
    "Secure Coding",
    "API Security",
    "Container Security",
    "Kubernetes Security"
  ],
  
  // Location-based keywords
  locationKeywords: [
    "Kenya",
    "Nairobi",
    "East Africa",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
    "African Cybersecurity",
    "Kenya IT Security",
    "Nairobi Security Services"
  ],
  
  // Service-specific keywords
  serviceKeywords: {
    penetrationTesting: [
      "Penetration Testing Kenya",
      "Ethical Hacking Services",
      "Security Testing",
      "Vulnerability Testing",
      "Web App Penetration Testing",
      "Network Penetration Testing",
      "Mobile App Security Testing"
    ],
    vulnerabilityAssessment: [
      "Vulnerability Assessment Kenya",
      "Security Vulnerability Scanning",
      "Risk Assessment",
      "Security Audit",
      "Compliance Testing"
    ],
    incidentResponse: [
      "Incident Response Kenya",
      "Cyber Incident Management",
      "Breach Response",
      "Digital Forensics",
      "Malware Analysis",
      "Cyber Crime Investigation"
    ],
    securityConsulting: [
      "Cybersecurity Consulting Kenya",
      "Security Strategy",
      "Risk Management",
      "Security Architecture",
      "Compliance Consulting"
    ]
  }
};

// Generate keyword string for meta tags
export const generateKeywords = (pageSpecificKeywords: string[] = []): string => {
  const allKeywords = [
    ...seoConfig.coreKeywords,
    ...seoConfig.extendedKeywords,
    ...seoConfig.locationKeywords,
    ...pageSpecificKeywords
  ];
  
  return allKeywords.join(', ');
};

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    keywords: generateKeywords([
      "Cybersecurity Company Kenya",
      "Security Services Nairobi",
      "Professional Cybersecurity"
    ])
  },
  services: {
    title: "Cybersecurity Services | Penetration Testing | AEDI Security Kenya",
    description: "Professional cybersecurity services in Kenya. Penetration testing, vulnerability assessment, incident response, security auditing, and cybersecurity research. Expert security consulting from AEDI Security Ltd.",
    keywords: generateKeywords([
      ...seoConfig.serviceKeywords.penetrationTesting,
      ...seoConfig.serviceKeywords.vulnerabilityAssessment,
      ...seoConfig.serviceKeywords.incidentResponse,
      ...seoConfig.serviceKeywords.securityConsulting
    ])
  },
  about: {
    title: "About AEDI Security | Afrensics E-System Defence & Intelligence Security Ltd",
    description: "Learn about AEDI Security Ltd, Kenya's premier cybersecurity firm. Our expert team provides penetration testing, vulnerability assessment, incident response, and cybersecurity research services across East Africa.",
    keywords: generateKeywords([
      "About AEDI Security",
      "Cybersecurity Company Kenya",
      "Security Team",
      "Penetration Testing Experts"
    ])
  },
  contact: {
    title: "Contact AEDI Security | Get Cybersecurity Consultation | Kenya",
    description: "Contact AEDI Security Ltd for professional cybersecurity services in Kenya. Get expert consultation on penetration testing, vulnerability assessment, incident response, and security solutions.",
    keywords: generateKeywords([
      "Contact AEDI Security",
      "Cybersecurity Consultation Kenya",
      "Security Services Contact"
    ])
  },
  blog: {
    title: "Cybersecurity Blog | Latest Security News & Insights | AEDI Security",
    description: "Stay updated with the latest cybersecurity trends, threats, and insights from AEDI Security's expert team. Read about penetration testing, vulnerability research, and security best practices.",
    keywords: generateKeywords([
      "Cybersecurity Blog",
      "Security News",
      "Cyber Threats",
      "Security Insights"
    ])
  },
  checkBreach: {
    title: "Check Data Breach | Have I Been Pwned | AEDI Security Kenya",
    description: "Check if your email has been compromised in a data breach. Free breach checking tool by AEDI Security. Protect yourself from cyber threats and data breaches.",
    keywords: generateKeywords([
      "Data Breach Check",
      "Have I Been Pwned",
      "Email Breach Check",
      "Cybersecurity Tool"
    ])
  }
};
