import { useEffect, useRef, useState } from 'react';

// Fades + slides content up as it scrolls into view. Respects
// prefers-reduced-motion globally via the transition-duration override in
// index.css, so this stays purely decorative, never load-bearing for content.
//
// Content must never depend on a genuine scroll/intersection event to become
// visible — anything that renders the page without simulating real scrolling
// (a screenshot tool, a crawler, print/reader mode) would otherwise see
// permanently blank sections. A timeout fallback guarantees visibility even
// if IntersectionObserver never fires.
export default function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const reveal = () => setVisible(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);

    const fallback = setTimeout(reveal, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
