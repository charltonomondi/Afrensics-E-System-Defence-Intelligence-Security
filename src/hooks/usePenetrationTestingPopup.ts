import { useState, useEffect, useCallback, useRef } from 'react';

export const usePenetrationTestingPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [lastShown, setLastShown] = useState<number>(0);
  const [userDismissed, setUserDismissed] = useState(false);

  // Track last time we detected user activity
  const lastActivityRef = useRef<number>(Date.now());

  // Config
  const IDLE_TIMEOUT = 180000; // 3 minutes
  const INITIAL_SHOW_DELAY = 2000; // 2 seconds after initial load
  const DISMISS_COOLDOWN = 300000; // 5 minutes cooldown after user dismisses

  const isTyping = () => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return false;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true;
    return el.isContentEditable === true;
  };

  const showPopup = useCallback(() => {
    const now = Date.now();

    // Respect cooldown after a manual dismiss
    if (userDismissed && now - lastShown < DISMISS_COOLDOWN) {
      return;
    }

    // Do not show while user is typing/focused in an input
    if (isTyping()) {
      return;
    }

    if (isPopupOpen) {
      return;
    }

    setIsPopupOpen(true);
    setLastShown(now);
    setUserDismissed(false);
  }, [isPopupOpen, lastShown, userDismissed]);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setUserDismissed(true);
    setLastShown(Date.now());
  }, []);

  // Track user activity and close popup immediately on activity to avoid interruption
  useEffect(() => {
    const markActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events: Array<keyof DocumentEventMap> = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'];
    events.forEach((evt) => document.addEventListener(evt, markActivity, { passive: true }));

    return () => {
      events.forEach((evt) => document.removeEventListener(evt, markActivity));
    };
  }, []);

  // Show once shortly after first entering the website
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      showPopup();
    }, INITIAL_SHOW_DELAY);

    return () => clearTimeout(initialTimer);
  }, [showPopup]);

  // Idle detection: show when the screen is idle (no cursor/typing) for 3 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const idleFor = now - lastActivityRef.current;
      if (!isPopupOpen && idleFor >= IDLE_TIMEOUT) {
        showPopup();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isPopupOpen, showPopup]);

  
  return {
    isPopupOpen,
    closePopup,
    showPopup,
  };
};
