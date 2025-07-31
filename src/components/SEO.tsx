import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Afrensics E-System Defence & Intelligence Security Ltd | AEDI Security | Kenya's Premier Cybersecurity Firm",
  description = "AEDI Security Ltd - Kenya's leading cybersecurity firm specializing in penetration testing, vulnerability assessment, incident response, cybersecurity research, machine learning security, and software development.",
  keywords = "Afrensics E-System Defence and Intelligence Security, AEDI Security Ltd, Cybersecurity, Software Development, Penetration Testing, Incident Response, Cybersecurity Research, Machine Learning, Afrensics, AEDI, Security, Vulnerability Assessment, Ethical Hacking, Kenya Cybersecurity",
  image = "https://aedisecurity.com/src/assets/favicon_logo/aedi.jpeg",
  url,
  type = "website"
}) => {
  const location = useLocation();
  const currentUrl = url || `https://aedisecurity.com${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);

    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:url', currentUrl);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

  }, [title, description, keywords, image, currentUrl, type]);

  return null;
};

export default SEO;
