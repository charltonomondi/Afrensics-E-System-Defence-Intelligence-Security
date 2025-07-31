import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics tracking ID - replace with your actual GA4 tracking ID
const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your actual Google Analytics 4 tracking ID

// Google Tag Manager ID - replace with your actual GTM ID
const GTM_ID = 'GTM-XXXXXXX'; // Replace with your actual Google Tag Manager ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    if (typeof window !== 'undefined' && GA_TRACKING_ID) {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    // Initialize Google Tag Manager
    if (typeof window !== 'undefined' && GTM_ID) {
      // GTM script
      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `;
      document.head.appendChild(gtmScript);

      // GTM noscript fallback
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
      document.body.appendChild(noscript);
    }
  }, []);

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
      window.gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
};

// Custom event tracking functions
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track specific business events
export const trackBusinessEvents = {
  contactFormSubmit: () => trackEvent('submit', 'contact_form', 'contact_page'),
  serviceInquiry: (service: string) => trackEvent('inquiry', 'service', service),
  brochureDownload: () => trackEvent('download', 'brochure', 'services_brochure'),
  phoneCall: () => trackEvent('click', 'phone', 'header_phone'),
  emailClick: () => trackEvent('click', 'email', 'header_email'),
  socialMediaClick: (platform: string) => trackEvent('click', 'social_media', platform),
  breachCheck: () => trackEvent('check', 'breach_tool', 'email_breach_check'),
  blogRead: (title: string) => trackEvent('read', 'blog', title),
  servicePageView: (service: string) => trackEvent('view', 'service_page', service),
};

export default Analytics;
