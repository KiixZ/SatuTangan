/**
 * Utility to dynamically load Midtrans Snap script
 */

const MIDTRANS_SCRIPT_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '';

let isLoaded = false;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

/**
 * Load Midtrans Snap script dynamically
 * @returns Promise that resolves when script is loaded
 */
export const loadMidtransScript = (): Promise<void> => {
  // If already loaded, return immediately
  if (isLoaded && window.snap) {
    return Promise.resolve();
  }

  // If currently loading, return existing promise
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // Check if client key is configured
  if (!MIDTRANS_CLIENT_KEY) {
    console.warn('Midtrans client key not configured. Set VITE_MIDTRANS_CLIENT_KEY in .env file');
    return Promise.reject(new Error('Midtrans client key not configured'));
  }

  // Start loading
  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector(
      `script[src="${MIDTRANS_SCRIPT_URL}"]`
    );

    if (existingScript) {
      // Script exists, check if snap is available
      if (window.snap) {
        isLoaded = true;
        isLoading = false;
        resolve();
        return;
      }

      // Script exists but snap not ready, wait for it
      existingScript.addEventListener('load', () => {
        isLoaded = true;
        isLoading = false;
        resolve();
      });
      return;
    }

    // Create new script element
    const script = document.createElement('script');
    script.src = MIDTRANS_SCRIPT_URL;
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
    script.type = 'text/javascript';

    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load Midtrans Snap script'));
    };

    // Append to head
    document.head.appendChild(script);
  });

  return loadPromise;
};

/**
 * Check if Midtrans is loaded and ready
 */
export const isMidtransReady = (): boolean => {
  return isLoaded && !!window.snap;
};

/**
 * Get Midtrans Snap instance
 */
export const getMidtransSnap = () => {
  if (!window.snap) {
    throw new Error('Midtrans Snap not loaded. Call loadMidtransScript() first.');
  }
  return window.snap;
};

// Declare Midtrans Snap types
declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
      hide: () => void;
      show: () => void;
    };
  }
}
