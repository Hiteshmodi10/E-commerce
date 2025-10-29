"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Download,
  ArrowLeft,
  Phone,
  Mail,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRequireAuth } from "../../../hooks/useRequireAuth";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "razorpay" | "cod";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  total: number;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useRequireAuth();
  const orderId = params.id as string;

  // Fetch order details
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!user?.id || !orderId) return null;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
      }
    },
    enabled: !!user?.id && !!orderId,
  });

  const loading = authLoading || isLoading;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={20} />;
      case "confirmed":
        return <CheckCircle size={20} />;
      case "shipped":
        return <Truck size={20} />;
      case "delivered":
        return <Package size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 25;
      case "confirmed":
        return 50;
      case "shipped":
        return 75;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find the order you're looking for. It may have been
              deleted or you may not have permission to view it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => refetch()}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/orders")}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold inline-flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span>Back to Orders</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
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
            onClick={() => router.push("/orders")}
            className="hover:text-blue-600 transition-colors"
          >
            Orders
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            Order #{order.orderNumber}
          </span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-2">
              Order #{order.orderNumber} • Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => router.push("/orders")}
            className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Orders</span>
          </button>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
            <div
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
            >
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getStatusProgress(order.status)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Order Placed</span>
              <span>Confirmed</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              className={`text-center p-4 rounded-lg ${order.status === "pending" || order.status === "confirmed" || order.status === "shipped" || order.status === "delivered" ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="text-white" size={16} />
              </div>
              <div className="text-sm font-medium text-gray-900">
                Order Placed
              </div>
              <div className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div
              className={`text-center p-4 rounded-lg ${order.status === "confirmed" || order.status === "shipped" || order.status === "delivered" ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${order.status === "confirmed" || order.status === "shipped" || order.status === "delivered" ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <CheckCircle className={`text-white`} size={16} />
              </div>
              <div className="text-sm font-medium text-gray-900">Confirmed</div>
              <div className="text-xs text-gray-500">Processing</div>
            </div>

            <div
              className={`text-center p-4 rounded-lg ${order.status === "shipped" || order.status === "delivered" ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${order.status === "shipped" || order.status === "delivered" ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <Truck className={`text-white`} size={16} />
              </div>
              <div className="text-sm font-medium text-gray-900">Shipped</div>
              <div className="text-xs text-gray-500">
                {order.trackingNumber
                  ? `Tracking: ${order.trackingNumber}`
                  : "Preparing shipment"}
              </div>
            </div>

            <div
              className={`text-center p-4 rounded-lg ${order.status === "delivered" ? "bg-green-50 border-green-200" : "bg-gray-50"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${order.status === "delivered" ? "bg-green-600" : "bg-gray-300"}`}
              >
                <Package className={`text-white`} size={16} />
              </div>
              <div className="text-sm font-medium text-gray-900">Delivered</div>
              <div className="text-xs text-gray-500">
                {order.estimatedDelivery
                  ? new Date(order.estimatedDelivery).toLocaleDateString()
                  : "Pending"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Items
            </h2>

            <div className="space-y-4">
              {order.items.map((item: OrderItem, index: number) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-6" />

            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>
                  ₹
                  {(order.total / 1.18).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (18%)</span>
                <span>
                  ₹
                  {(order.total - order.total / 1.18).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>
                  ₹
                  {order.total.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-6">
            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Payment Information
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span
                    className={`font-medium ${order.paymentStatus === "completed" ? "text-green-600" : order.paymentStatus === "pending" ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </span>
                </div>
                {order.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-mono text-sm">{order.paymentId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="mr-2 text-blue-600" size={20} />
                Shipping Address
              </h2>

              <div className="text-gray-600 space-y-2">
                <div className="font-medium text-gray-900">
                  {order.shippingAddress.fullName}
                </div>
                <div>{order.shippingAddress.address}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </div>
                <div>{order.shippingAddress.country}</div>
                <div className="flex items-center space-x-2 pt-2">
                  <Phone size={16} />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {order.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Order Notes
                </h3>
                <p className="text-blue-800">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {order.trackingNumber && (
            <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              <Truck size={20} />
              <span>Track Package</span>
            </button>
          )}

          <button className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold">
            <Mail size={20} />
            <span>Contact Support</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
