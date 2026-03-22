import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const TawkChat = () => {
  useEffect(() => {
    // Only load Tawk.to in production and if not already loaded
    if (import.meta.env.PROD && !window.Tawk_API) {
      // Initialize Tawk_API
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      // Create and load the script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/67bc5eb63cbf3e190b897ad0/1ikrt3vsb';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      // Add error handling
      script.onerror = () => {
        console.warn('Tawk.to chat widget failed to load');
      };

      // Insert the script
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }

      // Cleanup function
      return () => {
        // Remove the script when component unmounts
        const tawkScript = document.querySelector('script[src*="embed.tawk.to"]');
        if (tawkScript) {
          tawkScript.remove();
        }
        
        // Clean up global variables
        if (window.Tawk_API) {
          delete window.Tawk_API;
        }
        if (window.Tawk_LoadStart) {
          delete window.Tawk_LoadStart;
        }
      };
    }
  }, []);

  // Don't render anything in development
  if (import.meta.env.DEV) {
    return null;
  }

  return null; // This component doesn't render any JSX
};

export default TawkChat;
