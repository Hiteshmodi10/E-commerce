"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import { CreditCard, Truck, Shield, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import supabase from "../../lib/supabaseClient";

// Declare Razorpay globally
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function CheckoutPage() {
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const router = useRouter();

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 299.99,
      image: "/api/placeholder/300/300",
      category: "Electronics"
    },
    {
      id: "2", 
      name: "Smart Fitness Watch",
      price: 199.99,
      image: "/api/placeholder/300/300",
      category: "Electronics"
    },
    {
      id: "3",
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      image: "/api/placeholder/300/300", 
      category: "Fashion"
    }
  ];

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      try {
        if (supabase?.auth?.getSession) {
          const result = await supabase.auth.getSession();
          const currentUser = (result as any)?.data?.session?.user;
          setUser(currentUser);

          if (currentUser) {
            // Pre-fill email
            setShippingInfo((prev) => ({
              ...prev,
              email: currentUser.email || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };

    getUser();
    setProducts(mockProducts);
    loadCartItems();
    setLoading(false);
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    loadRazorpay();
  }, []);

  const loadCartItems = () => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    if (guestCart.length === 0) {
      router.push("/cart");
    }
    setCartItems(guestCart);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.18; // 18% GST for India
  const total = subtotal + shipping + tax;

  const handlePayment = async () => {
    if (!window.Razorpay) {
      alert("Payment system is not available. Please try again later.");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate creating Razorpay order (replace with actual API call)
      const orderData = {
        id: `order_${Date.now()}`,
        amount: Math.round(total * 100), // Convert to paise
        currency: "INR",
      };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1234567890", // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "E‑Shop",
        description: "Purchase from E‑Shop",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Simulate order creation
            const orderInfo = {
              userId: user?.id || "guest",
              items: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
              total: total,
              status: "confirmed",
              paymentId: response.razorpay_payment_id,
              shippingInfo: shippingInfo,
            };

            // Clear cart
            localStorage.setItem("guestCart", JSON.stringify([]));
            
            // Store order info temporarily for success page
            localStorage.setItem("lastOrder", JSON.stringify(orderInfo));

            router.push("/order-success");
          } catch (error) {
            console.error("Order creation error:", error);
            alert("Order processing failed. Please contact support.");
          }
        },
        prefill: {
          name: shippingInfo.fullName,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initialize payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.values(shippingInfo).every(
    (value) => value.trim() !== ""
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-lg"></div>
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button onClick={() => router.push("/")} className="hover:text-blue-600 transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => router.push("/cart")} className="hover:text-blue-600 transition-colors">
            Cart
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </button>
        </div>

        {/* Security Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="text-green-600" size={24} />
            <div>
              <div className="text-green-800 font-semibold">Secure SSL Encrypted Checkout</div>
              <div className="text-green-600 text-sm">Your payment information is protected with 256-bit SSL encryption</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Truck className="mr-2 text-blue-600" size={24} />
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+91 12345 67890"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Street address, apartment, suite, etc."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="City"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="State"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="PIN Code"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <CreditCard className="mr-2 text-blue-600" size={24} />
                Payment Method
              </h2>

              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">R</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Razorpay Secure Payment</div>
                    <div className="text-sm text-gray-600">UPI, Cards, Net Banking, Wallets & more</div>
                  </div>
                  <div className="ml-auto">
                    <CheckCircle className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2 text-xs text-gray-600">
                  <Lock size={12} />
                  <span>256-bit SSL secured payment processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-semibold text-gray-900">
                        ₹{(product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr className="my-6" />

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    💡 Add ₹{(50 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <hr className="my-6" />

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={!isFormValid || isProcessing}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    <span>Pay ₹{total.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield size={12} />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Lock size={12} />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle size={12} />
                  <span>Verified</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Powered by Razorpay • All transactions are secure and encrypted
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 bg-gray-100 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">We Accept:</div>
              <div className="flex items-center space-x-3">
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold">VISA</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold">MC</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold">UPI</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold">Wallet</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
