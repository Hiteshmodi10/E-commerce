"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CheckCircle, Package, Truck, Home, Download, Mail } from "lucide-react";

interface OrderInfo {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  total: number;
  status: string;
  paymentId: string;
  shippingInfo: any;
}

export default function OrderSuccessPage() {
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get order info from localStorage (in real app, fetch from API)
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
      const order = JSON.parse(lastOrder);
      setOrderInfo(order);
      setOrderNumber(`ESH${Date.now().toString().slice(-6)}`);
      
      // Clear the stored order
      localStorage.removeItem("lastOrder");
    } else {
      // Redirect to home if no order found
      router.push("/");
    }
  }, [router]);

  if (!orderInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-green-800 font-semibold text-lg">Order Number</div>
            <div className="text-green-900 text-2xl font-bold">{orderNumber}</div>
            <div className="text-green-600 text-sm mt-1">
              Keep this number for your records
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Order Confirmed</div>
                  <div className="text-sm text-gray-600">Just now</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="text-blue-600" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Order Processing</div>
                  <div className="text-sm text-gray-600">Expected within 24 hours</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Truck className="text-gray-400" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-700">Shipped</div>
                  <div className="text-sm text-gray-500">Expected in 1-2 days</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Home className="text-gray-400" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-700">Delivered</div>
                  <div className="text-sm text-gray-500">
                    Expected by {estimatedDelivery.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <Mail size={20} />
                <span className="font-semibold">Email Confirmation Sent</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                Check your email for order details and tracking information.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Total</span>
                <span className="font-semibold">₹{orderInfo.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">Razorpay</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID</span>
                <span className="font-mono text-sm">{orderInfo.paymentId}</span>
              </div>
            </div>

            <hr className="my-6" />

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
              <div className="text-gray-600 space-y-1">
                <div>{orderInfo.shippingInfo.fullName}</div>
                <div>{orderInfo.shippingInfo.address}</div>
                <div>
                  {orderInfo.shippingInfo.city}, {orderInfo.shippingInfo.state} {orderInfo.shippingInfo.postalCode}
                </div>
                <div>{orderInfo.shippingInfo.country}</div>
                <div>{orderInfo.shippingInfo.phone}</div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2">
                <Download size={20} />
                <span>Download Invoice</span>
              </button>
              
              <button
                onClick={() => router.push("/orders")}
                className="w-full bg-white text-blue-600 border border-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                View Order Details
              </button>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-purple-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Check Your Email</h3>
              <p className="text-gray-600 text-sm">
                We've sent you a confirmation email with order details and tracking information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-orange-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Your Order</h3>
              <p className="text-gray-600 text-sm">
                You'll receive tracking information once your order ships. Track it anytime in your account.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-green-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Ready for Delivery</h3>
              <p className="text-gray-600 text-sm">
                Your order will be delivered within 3-5 business days. Make sure someone is available to receive it.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Continue Shopping</h3>
          <p className="text-gray-600 mb-6">
            Discover more amazing products in our store
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/products")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Browse Products
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Customer Support */}
        <div className="mt-12 bg-gray-100 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our customer support team is here to help you with any questions about your order.
          </p>
          <div className="space-x-4">
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Contact Support
            </button>
            <span className="text-gray-400">|</span>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              FAQ
            </button>
            <span className="text-gray-400">|</span>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Live Chat
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
