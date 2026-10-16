/ Utility for loading and triggering Razorpay India Checkout in Real Mode

export interface RazorpayOptions {
  key?: string;
  amount: number; // in INR (converted to paise internally)
  currency?: string;
  name: string;
  description: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load Razorpay Checkout script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async (
  options: RazorpayOptions,
  onSuccess: (res: RazorpayPaymentResponse) => void,
  onError?: (err: any) => void
): Promise<void> => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || typeof (window as any).Razorpay === 'undefined') {
    if (onError) onError(new Error('Razorpay SDK could not be loaded'));
    return;
  }

  // Real Mode Key ID: Reads from VITE_RAZORPAY_KEY_ID or active live key
  const envKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
  const razorpayKey =
    options.key ||
    envKey ||
    'rzp_live_ILt9V4l3kH7O8u'; // Real Mode Key ID fallback for Indian payments

  const rzpOptions: any = {
    key: razorpayKey,
    amount: Math.round(options.amount * 100), // Razorpay expects amount in paise (1 INR = 100 paise)
    currency: options.currency || 'INR',
    name: options.name || 'Acharya Jitender Shastri',
    description: options.description || 'Vedic Consultation Dakshina',
    image:
      options.image ||
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Om_symbol.svg/120px-Om_symbol.svg.png',
    prefill: {
      name: options.prefill?.name || '',
      email: options.prefill?.email || '',
      contact: options.prefill?.contact || '',
    },
    notes: {
      address: 'Chandigarh, India',
      merchant_account: 'Jitender Kumar Sharma',
      upi_id: 'jksv390-1@okaxis',
      ...(options.notes || {}),
    },
    theme: {
      color: options.theme?.color || '#eab308', // Sacred Vedic gold
    },
    handler: (response: RazorpayPaymentResponse) => {
      console.log('Razorpay payment successful:', response);
      onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        console.log('Razorpay checkout modal closed by user');
        if (options.modal?.ondismiss) options.modal.ondismiss();
      },
    },
  };

  try {
    const rzpInstance = new (window as any).Razorpay(rzpOptions);
    rzpInstance.on('payment.failed', (response: any) => {
      console.warn('Razorpay payment failure:', response?.error);
      if (onError) onError(response?.error);
    });
    rzpInstance.open();
  } catch (err) {
    console.error('Error invoking Razorpay checkout:', err);
    if (onError) onError(err);
  }
};
