'use client';

import { useEffect } from 'react';

export function FixHydrationScript() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Remove browser extension attributes that cause hydration warnings
    const removeExtensionAttributes = () => {
      const attributes = [
        'bis_skin_checked',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'data-new-gr-c-s-loaded',
      ];

      attributes.forEach((attr) => {
        try {
          const elements = document.querySelectorAll(`[${attr}]`);
          elements.forEach((el) => {
            try {
              el.removeAttribute(attr);
            } catch (e) {
              // Ignore errors
            }
          });
        } catch (e) {
          // Ignore errors
        }
      });
    };

    // Run immediately
    removeExtensionAttributes();

    // Run after a short delay to catch dynamically added attributes
    const timeout1 = setTimeout(removeExtensionAttributes, 50);
    const timeout2 = setTimeout(removeExtensionAttributes, 200);
    const timeout3 = setTimeout(removeExtensionAttributes, 500);

    // Watch for new elements
    const observer = new MutationObserver(() => {
      removeExtensionAttributes();
    });

    try {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          'bis_skin_checked',
          'data-new-gr-c-s-check-loaded',
          'data-gr-ext-installed',
          'data-new-gr-c-s-loaded',
        ],
      });
    } catch (e) {
      // Ignore observer errors
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      try {
        observer.disconnect();
      } catch (e) {
        // Ignore
      }
    };
  }, []);

  return null;
}

