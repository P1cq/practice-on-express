// Lazily injects Google Identity Services — only pages that actually render
// a Google button pay for this third-party script, not the whole app.
let loadPromise = null;

export function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load Google Identity script'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
