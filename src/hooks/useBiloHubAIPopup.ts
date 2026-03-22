import { useState, useEffect } from 'react';

const BILOHUB_POPUP_KEY = 'aedi-bilohub-popup-shown';
const POPUP_DELAY = 8000; // Show after 8 seconds

export function useBiloHubAIPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasSeenPopup = sessionStorage.getItem(BILOHUB_POPUP_KEY);
    
    if (!hasSeenPopup) {
      // Show popup after delay
      const timer = setTimeout(() => {
        setIsPopupOpen(true);
        // Mark as shown
        sessionStorage.setItem(BILOHUB_POPUP_KEY, 'true');
      }, POPUP_DELAY);

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => setIsPopupOpen(false);

  return {
    isPopupOpen,
    closePopup,
    showPopup: () => {
      setIsPopupOpen(true);
      sessionStorage.setItem(BILOHUB_POPUP_KEY, 'true');
    }
  };
}
