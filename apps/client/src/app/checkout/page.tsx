"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import {
  CreditCard,
  Truck,
  Shield,
  Lock,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listProductsBuilder } from "@repo/api-client";
import { useCart } from "../../contexts/CartContext";
import RazorpayService from "../../services/razorpay";
import supabase from "../../lib/supabaseClient";

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
  stock: number;
}

export default function CheckoutPage() {
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">(
    "razorpay"
  );
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
  const { state, getCartTotal, clearCart } = useCart();

  // Mock products data - replaced with real API call
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 24999.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      category: "Electronics",
      stock: 50,
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      price: 16699.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      category: "Electronics",
      stock: 30,
    },
    {
      id: "3",
      name: "Organic Cotton T-Shirt",
      price: 2499.99,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      category: "Fashion",
      stock: 100,
    },
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

    // Check if cart is empty and redirect
    if (state.items.length === 0) {
      router.push("/cart");
    }

    setLoading(false);
  }, [state.items.length, router]);

  // Fetch products from API
  const { data: apiProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const result = await (listProductsBuilder.resolver as any)();
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    },
  });

  // Combine mock products with API products for fallback
  const allProducts = [...mockProducts, ...apiProducts];

  // Remove duplicates based on ID
  const availableProducts = allProducts.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );

  // Calculate totals
  const subtotal = getCartTotal(availableProducts);
  const shipping = subtotal > 5000 ? 0 : paymentMethod === "cod" ? 149 : 99; // Higher shipping for COD
  const tax = subtotal * 0.18; // 18% GST for India
  const codCharge = paymentMethod === "cod" ? 50 : 0; // COD handling charge
  const total = subtotal + shipping + tax + codCharge;

  const handlePayment = async () => {
    if (!isFormValid) return;

    setIsProcessing(true);

    try {
      if (paymentMethod === "cod") {
        await handleCODOrder();
      } else {
        await handleRazorpayPayment();
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("Order processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleCODOrder = async () => {
    try {
      const orderData = {
        userId: user?.id || "guest",
        items: state.items.map((item) => {
          const product = availableProducts.find(
            (p) => p.id === item.productId
          );
          return {
            productId: item.productId,
            name: product?.name || "Unknown Product",
            price: product?.price || 0,
            image: product?.image || "",
            quantity: item.quantity,
          };
        }),
        total: total,
        paymentMethod: "cod",
        paymentStatus: "pending",
        shippingAddress: {
          fullName: shippingInfo.fullName,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postalCode: shippingInfo.postalCode,
          country: shippingInfo.country,
          phone: shippingInfo.phone,
        },
        notes: "Cash on Delivery order",
      };

      console.log("Creating COD order with user ID:", user?.id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/orders/place-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("COD order creation failed:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const order = await response.json();
      console.log("COD order created successfully:", order);

      // Clear cart
      await clearCart();

      // Store order info for success page
      localStorage.setItem("lastOrder", JSON.stringify(order));

      router.push("/order-success");
    } catch (error) {
      console.error("COD order creation error:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      await RazorpayService.processPayment(
        total,
        {
          customerName: shippingInfo.fullName,
          customerEmail: shippingInfo.email,
          customerPhone: shippingInfo.phone,
        },
        async (paymentData) => {
          try {
            // Create order after successful payment
            const orderData = {
              userId: user?.id || "guest",
              items: state.items.map((item) => {
                const product = availableProducts.find(
                  (p) => p.id === item.productId
                );
                return {
                  productId: item.productId,
                  name: product?.name || "Unknown Product",
                  price: product?.price || 0,
                  image: product?.image || "",
                  quantity: item.quantity,
                };
              }),
              total: total,
              paymentMethod: "razorpay",
              paymentStatus: "completed",
              paymentId: paymentData.paymentId,
              shippingAddress: {
                fullName: shippingInfo.fullName,
                address: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                postalCode: shippingInfo.postalCode,
                country: shippingInfo.country,
                phone: shippingInfo.phone,
              },
            };

            console.log("Creating Razorpay order with user ID:", user?.id);

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/orders/place-order`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
              }
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.error(
                "Razorpay order creation failed:",
                response.status,
                errorText
              );
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const order = await response.json();
            console.log("Razorpay order created successfully:", order);

            // Clear cart
            await clearCart();

            // Store order info for success page
            localStorage.setItem("lastOrder", JSON.stringify(order));

            router.push("/order-success");
          } catch (error) {
            console.error("Order creation error:", error);
            alert("Order processing failed. Please contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        (error) => {
          console.error("Payment error:", error);
          if (error.message !== "Payment cancelled by user") {
            alert(`Payment failed: ${error.message}`);
          }
          setIsProcessing(false);
        }
      );
    } catch (error) {
      console.error("Payment initialization error:", error);
      throw error;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  if (state.items.length === 0) {
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
          <button
            onClick={() => router.push("/")}
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => router.push("/cart")}
            className="hover:text-blue-600 transition-colors"
          >
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
              <div className="text-green-800 font-semibold">
                Secure SSL Encrypted Checkout
              </div>
              <div className="text-green-600 text-sm">
                Your payment information is protected with 256-bit SSL
                encryption
              </div>
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

              <div className="space-y-4">
                {/* Online Payment Option */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("razorpay")}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">R</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        Online Payment
                      </div>
                      <div className="text-sm text-gray-600">
                        UPI, Cards, Net Banking, Wallets & more
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Instant confirmation • Faster delivery
                      </div>
                    </div>
                    {paymentMethod === "razorpay" && (
                      <CheckCircle className="text-blue-600" size={24} />
                    )}
                  </div>
                  {paymentMethod === "razorpay" && (
                    <div className="mt-3 flex items-center space-x-2 text-xs text-gray-600">
                      <Lock size={12} />
                      <span>256-bit SSL secured payment processing</span>
                    </div>
                  )}
                </div>

                {/* COD Option */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 text-orange-600"
                    />
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">₹</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        Cash on Delivery
                      </div>
                      <div className="text-sm text-gray-600">
                        Pay when you receive your order
                      </div>
                      <div className="text-xs text-orange-600 font-medium">
                        Additional ₹{codCharge} handling charge • 7-10 days
                        delivery
                      </div>
                    </div>
                    {paymentMethod === "cod" && (
                      <CheckCircle className="text-orange-600" size={24} />
                    )}
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="mt-3 p-3 bg-orange-100 rounded-lg">
                      <div className="text-sm text-orange-800">
                        <strong>Note:</strong> Cash on Delivery orders take
                        longer to process and deliver. Payment must be made in
                        cash to the delivery person.
                      </div>
                    </div>
                  )}
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
                {state.items.map((item) => {
                  const product = availableProducts.find(
                    (p) => p.id === item.productId
                  );
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
                        <h3 className="font-medium text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="font-semibold text-gray-900">
                        ₹
                        {(product.price * item.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr className="my-6" />

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal (
                    {state.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping {paymentMethod === "cod" ? "(COD)" : ""}</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      `₹${shipping.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>
                {shipping > 0 && paymentMethod === "razorpay" && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    💡 Add ₹{(5000 - subtotal).toLocaleString("en-IN")} more for
                    free shipping!
                  </div>
                )}
                {paymentMethod === "cod" && codCharge > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>COD Handling Charge</span>
                    <span>₹{codCharge.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>

                {paymentMethod === "cod" && (
                  <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                    <div className="font-medium mb-1">
                      COD Delivery Information:
                    </div>
                    <ul className="text-xs space-y-1">
                      <li>• Delivery in 7-10 business days</li>
                      <li>• Additional handling charge applies</li>
                      <li>• Payment in cash only</li>
                      <li>• Order confirmation via SMS/Email</li>
                    </ul>
                  </div>
                )}
              </div>

              <hr className="my-6" />

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={!isFormValid || isProcessing}
                className={`w-full py-4 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-lg transition-colors flex items-center justify-center space-x-2 ${
                  paymentMethod === "cod"
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : paymentMethod === "cod" ? (
                  <>
                    <span>📦</span>
                    <span>
                      Place COD Order ₹{total.toLocaleString("en-IN")}
                    </span>
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    <span>Pay ₹{total.toLocaleString("en-IN")}</span>
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
              <div className="text-sm font-medium text-gray-700 mb-3">
                We Accept:
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold">
                  VISA
                </div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold">
                  MC
                </div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold">
                  UPI
                </div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold">
                  Wallet
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
