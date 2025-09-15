"use client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface OrderData {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
}

class RazorpayService {
  private static instance: RazorpayService;
  private isLoaded = false;

  private constructor() {}

  public static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService();
    }
    return RazorpayService.instance;
  }

  // Load Razorpay script
  public async loadRazorpay(): Promise<boolean> {
    if (this.isLoaded && window.Razorpay) {
      return true;
    }

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        this.isLoaded = true;
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  // Create order (calls backend API)
  public async createOrder(amount: number, currency: string = "INR"): Promise<OrderData> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: `receipt_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const order = await response.json();
      
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  }

  // Verify payment (calls backend API)
  public async verifyPayment(
    paymentId: string,
    orderId: string,
    signature: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId, orderId, signature }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.verified === true;
    } catch (error) {
      console.error("Error verifying payment:", error);
      return false;
    }
  }

  // Open Razorpay checkout
  public async openCheckout(options: RazorpayOptions): Promise<void> {
    const isLoaded = await this.loadRazorpay();
    
    if (!isLoaded || !window.Razorpay) {
      throw new Error("Failed to load Razorpay");
    }

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  // Complete payment flow
  public async processPayment(
    amount: number,
    orderDetails: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
    },
    onSuccess: (paymentData: any) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      // Step 1: Create order
      const order = await this.createOrder(amount);

      // Step 2: Configure Razorpay options
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1234567890",
        amount: order.amount,
        currency: order.currency,
        name: "E‑Shop",
        description: "Purchase from E‑Shop",
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            // Step 3: Verify payment
            const isVerified = await this.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            if (isVerified) {
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                amount: order.amount,
              });
            } else {
              onError(new Error("Payment verification failed"));
            }
          } catch (error) {
            onError(error as Error);
          }
        },
        prefill: {
          name: orderDetails.customerName,
          email: orderDetails.customerEmail,
          contact: orderDetails.customerPhone,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => {
            onError(new Error("Payment cancelled by user"));
          },
        },
      };

      // Step 4: Open checkout
      await this.openCheckout(options);
    } catch (error) {
      onError(error as Error);
    }
  }
}

export default RazorpayService.getInstance();
