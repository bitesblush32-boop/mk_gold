'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Global IntersectionObserver for all .reveal* elements.
 * Re-runs on every client-side route change so navigating back to a page
 * correctly reveals all elements instead of leaving them invisible.
 */
export function MkRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Wait one frame for React to finish painting new DOM nodes
    const timer = setTimeout(() => {
      // Only select elements that haven't been revealed yet
      const els = document.querySelectorAll<HTMLElement>(
        '.reveal:not(.in), .reveal-l:not(.in), .reveal-r:not(.in), .reveal-scale:not(.in)'
      );
      if (!els.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: '0px 0px -16px 0px' }
      );

      els.forEach((el) => observer.observe(el));
      // Cleanup: disconnect observer when pathname changes again
      return () => observer.disconnect();
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
