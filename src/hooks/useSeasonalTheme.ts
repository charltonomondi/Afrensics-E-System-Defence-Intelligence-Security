import { useEffect, useState } from 'react';

const THEME_KEY = 'aedi-seasonal-theme';

type SeasonalTheme = 'default' | 'christmas';

export function useSeasonalTheme() {
  const [theme, setTheme] = useState<SeasonalTheme>(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem(THEME_KEY) as SeasonalTheme | null) : null;
    return saved || 'default';
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
    document.body.classList.toggle('christmas-theme', theme === 'christmas');
  }, [theme]);

  const enableChristmas = () => setTheme('christmas');
  const disableChristmas = () => setTheme('default');
  const toggle = () => setTheme((t) => (t === 'christmas' ? 'default' : 'christmas'));

  return {
    theme,
    isChristmas: theme === 'christmas',
    enableChristmas,
    disableChristmas,
    toggle,
  };
}
