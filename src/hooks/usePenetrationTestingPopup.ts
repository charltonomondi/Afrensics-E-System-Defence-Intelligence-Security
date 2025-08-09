import { useState, useEffect, useCallback } from 'react';

export const usePenetrationTestingPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [lastShown, setLastShown] = useState<number>(0);
  const [userDismissed, setUserDismissed] = useState(false);

  // Show popup every 2 minutes
  const POPUP_INTERVAL = 120000; // 2 minutes (120 seconds)
  const DISMISS_COOLDOWN = 300000; // 5 minutes cooldown after user dismisses

  const showPopup = useCallback(() => {
    const now = Date.now();
    
    // Don't show if user recently dismissed it
    if (userDismissed && now - lastShown < DISMISS_COOLDOWN) {
      return;
    }

    // Don't show if popup is already open
    if (isPopupOpen) {
      return;
    }

    // Show popup and update timestamp
    setIsPopupOpen(true);
    setLastShown(now);
    setUserDismissed(false);
  }, [isPopupOpen, lastShown, userDismissed]);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setUserDismissed(true);
    setLastShown(Date.now());
  }, []);

  // Auto-close popup after 15 seconds if user doesn't interact
  useEffect(() => {
    if (isPopupOpen) {
      const autoCloseTimer = setTimeout(() => {
        setIsPopupOpen(false);
      }, 15000); // Auto-close after 15 seconds

      return () => clearTimeout(autoCloseTimer);
    }
  }, [isPopupOpen]);

  // Set up interval to show popup every 2 minutes
  useEffect(() => {
    // Initial delay before first popup (10 seconds after page load)
    const initialTimer = setTimeout(() => {
      showPopup();
    }, 10000);

    // Regular interval for subsequent popups
    const interval = setInterval(() => {
      showPopup();
    }, POPUP_INTERVAL);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [showPopup]);

  // Listen for user activity to reset cooldown
  useEffect(() => {
    const handleUserActivity = () => {
      // Reset user dismissed flag after some activity
      if (userDismissed && Date.now() - lastShown > DISMISS_COOLDOWN) {
        setUserDismissed(false);
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [userDismissed, lastShown]);

  return {
    isPopupOpen,
    closePopup,
    showPopup
  };
};
