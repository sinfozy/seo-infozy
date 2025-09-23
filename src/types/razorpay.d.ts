declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open(): void;
      close(): void;
    };
  }
}

interface RazorpayPrefill {
  name: string;
  email: string;
}

interface RazorpayTheme {
  color: string;
}

export interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayHandlerResponse) => Promise<void>;
  prefill: RazorpayPrefill;
  theme: RazorpayTheme;
}

export {};
