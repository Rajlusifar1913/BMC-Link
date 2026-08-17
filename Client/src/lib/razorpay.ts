import type { VerifyPaymentPayload } from "./types";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

let razorpayScriptPromise: Promise<boolean> | null = null;

/**
 * Loads the Razorpay checkout script idempotently with singleton promise caching.
 */
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  // If already loaded and initialized in window
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  // Return existing singleton promise if load is in flight
  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  // Check if script tag already exists in DOM
  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
  );

  if (existingScript) {
    razorpayScriptPromise = new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
    });
    return razorpayScriptPromise;
  }

  // Inject script asynchronously with singleton cache
  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      razorpayScriptPromise = null; // allow retry if network failed
      resolve(false);
    };

    document.head.appendChild(script);
  });

  return razorpayScriptPromise;
}

/**
 * Preloads the Razorpay checkout script in the background during idle time.
 * Calling this on mount ensures 0ms instant checkout popups when users click Buy/Donate.
 */
export function preloadRazorpayScript(): void {
  if (typeof window === "undefined" || window.Razorpay) return;

  if ("requestIdleCallback" in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
      loadRazorpayScript();
    });
  } else {
    setTimeout(() => {
      loadRazorpayScript();
    }, 500);
  }
}

export interface RazorpayCheckoutOptions {
  keyId: string;
  orderId: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
}

export async function openRazorpayCheckout(
  options: RazorpayCheckoutOptions
): Promise<VerifyPaymentPayload> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error("Failed to load payment gateway. Please check your internet connection.");
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: options.keyId,
      amount: options.amount,
      currency: options.currency || "INR",
      name: options.name || "BMC Link",
      description: options.description || "Support Creator",
      image: options.image || undefined,
      order_id: options.orderId,
      prefill: options.prefill,
      theme: {
        color: options.theme?.color || "#820AD1",
      },
      handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        resolve({
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => {
          reject(new Error("Payment window was closed"));
        },
      },
    });

    rzp.on("payment.failed", (response: any) => {
      reject(new Error(response?.error?.description || "Payment failed"));
    });

    rzp.open();
  });
}
