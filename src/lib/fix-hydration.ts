/**
 * Fix hydration warnings caused by browser extensions
 * This removes attributes added by browser extensions that cause hydration mismatches
 */
export function fixHydrationWarnings() {
  if (typeof window === 'undefined') return;

  const extensionAttributes = [
    'bis_skin_checked',
    'data-new-gr-c-s-check-loaded',
    'data-gr-ext-installed',
    'data-new-gr-c-s-loaded',
  ];

  const removeAttributes = () => {
    extensionAttributes.forEach((attr) => {
      const elements = document.querySelectorAll(`[${attr}]`);
      elements.forEach((el) => {
        el.removeAttribute(attr);
      });
    });
  };

  // Run on mount and after a delay
  removeAttributes();
  setTimeout(removeAttributes, 100);
  setTimeout(removeAttributes, 500);

  // Also watch for new elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Element node
          extensionAttributes.forEach((attr) => {
            if ((node as Element).hasAttribute(attr)) {
              (node as Element).removeAttribute(attr);
            }
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: extensionAttributes,
  });

  return () => observer.disconnect();
}


