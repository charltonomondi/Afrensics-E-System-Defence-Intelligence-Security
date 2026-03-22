import React, { useEffect, useRef, useState } from 'react';

interface SnowOverlayProps {
  density?: number; // number of flakes
  disabledOnMobile?: boolean;
}

const isReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const SnowOverlay: React.FC<SnowOverlayProps> = ({ density = 60, disabledOnMobile = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Control visibility: show every 30 seconds for 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 10000); // 10 seconds
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;

    const isMobile = window.innerWidth < 640; // tailwind sm
    if (disabledOnMobile && isMobile) return;
    if (isReducedMotion()) return;

    type Flake = { x: number; y: number; r: number; s: number; a: number };
    let flakes: Flake[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // re-seed
      const count = Math.floor((density * width * height) / (1280 * 720));
      flakes = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1.5 + Math.random() * 2,
        s: 0.5 + Math.random() * 1.5,
        a: Math.random() * Math.PI * 2,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      flakes.forEach(f => {
        f.y += f.s;
        f.x += Math.sin(f.a) * 0.5;
        f.a += 0.01 + Math.random() * 0.01;
        if (f.y > height + 5) {
          f.y = -5;
          f.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationRef.current = requestAnimationFrame(step);
    };

    const onResize = () => {
      resize();
    };

    resize();
    step();

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [density, disabledOnMobile]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[5]" // below headers with higher z if needed
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
};

export default SnowOverlay;
