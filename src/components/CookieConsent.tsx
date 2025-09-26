import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = async () => {
    setIsLoading(true);

    try {
      // Load Google Analytics script
      const gaScript = document.createElement('script');
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-MRNP1SKCBF";
      gaScript.async = true;
      document.head.appendChild(gaScript);

      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }

      gtag('js', new Date());
      gtag('config', 'G-MRNP1SKCBF', { anonymize_ip: true });

      // Store consent in localStorage
      localStorage.setItem('cookieConsent', 'accepted');

      // Hide the banner
      setShowBanner(false);
    } catch (error) {
      console.error('Error loading Google Analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      id="cookie-banner"
      className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 text-center z-50 shadow-lg border-t border-gray-700"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm sm:text-base flex-1">
            We use cookies (including Google Analytics) to improve your experience and analyze site usage.
            By continuing to use our site, you consent to our use of cookies.
          </p>
          <button
            id="accept-cookies"
            onClick={handleAccept}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 whitespace-nowrap"
          >
            {isLoading ? 'Loading...' : 'Accept Cookies'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;