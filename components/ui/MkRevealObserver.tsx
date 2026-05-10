'use client';

import { useEffect } from 'react';

/**
 * Global IntersectionObserver for all .reveal* elements.
 * Mount once in layout — zero scroll listeners, GPU-only transitions.
 */
export function MkRevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-l, .reveal-r, .reveal-scale'
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
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
