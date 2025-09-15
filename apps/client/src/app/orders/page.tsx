"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Package, Clock, CheckCircle, Truck, MapPin, Download, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import supabase from "../../lib/supabaseClient";

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
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
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

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();

  // Fetch user orders from API
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const userId = user?.id;
      if (!userId) {
        console.log("No user ID available for fetching orders");
        return [];
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        // Get the current session to extract the access token
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        
        console.log("Fetching orders for user:", userId);
        console.log("Using access token:", accessToken ? "Available" : "Not available");
        
        const response = await fetch(`${apiUrl}/api/orders/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && {
              'Authorization': `Bearer ${accessToken}`
            })
          },
        });

        console.log("Orders API response status:", response.status);

        if (!response.ok) {
          // If the endpoint doesn't exist or user is not authenticated, return empty array
          if (response.status === 404 || response.status === 401) {
            console.warn(`Orders API returned ${response.status}, returning empty orders list`);
            return [];
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Orders data received:", data);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Return empty array instead of throwing to prevent page crash
        return [];
      }
    },
    enabled: !!user?.id, // Only run query when user is available
    retry: 1, // Only retry once
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const loading = authLoading || isLoading;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <Package size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error if API fails
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Unable to Load Orders</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're having trouble loading your orders. Please check your connection and try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => refetch()}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Retry
              </button>
              <button
                onClick={() => router.push("/products")}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold inline-flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span>Continue Shopping</span>
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

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button onClick={() => router.push("/")} className="hover:text-blue-600 transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">My Orders</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
          </div>
          <button
            onClick={() => router.push("/products")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Continue Shopping</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={80} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No Orders Yet</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            
            {/* Debug information in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left max-w-md mx-auto">
                <p className="text-sm text-gray-700 mb-2"><strong>Debug Info:</strong></p>
                <p className="text-xs text-gray-600">User ID: {user?.id || 'Not available'}</p>
                <p className="text-xs text-gray-600">Auth Loading: {authLoading ? 'Yes' : 'No'}</p>
                <p className="text-xs text-gray-600">Orders Loading: {isLoading ? 'Yes' : 'No'}</p>
                <p className="text-xs text-gray-600">Error: {error ? 'Yes' : 'No'}</p>
                <p className="text-xs text-gray-600">Orders Count: {orders.length}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <button
                onClick={() => router.push("/products")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Start Shopping
              </button>
              
              <div className="text-sm text-gray-500">
                <p>Recent order not showing up?</p>
                <button 
                  onClick={() => refetch()}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Refresh orders
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'} 
                          ({order.paymentStatus})
                        </div>
                      </div>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      {order.trackingNumber && (
                        <div className="text-sm text-gray-600">
                          Tracking: {order.trackingNumber}
                        </div>
                      )}
                      {order.estimatedDelivery && (
                        <div className="text-sm text-green-600">
                          Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item: OrderItem, index: number) => (
                      <div key={`${item.productId}-${index}`} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ₹{((item.price * item.quantity)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-gray-600">
                            ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                {order.notes && (
                  <div className="px-6 py-3 bg-blue-50 border-t border-gray-200">
                    <div className="text-sm text-blue-800">
                      <strong>Notes:</strong> {order.notes}
                    </div>
                  </div>
                )}

                {/* Order Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span>
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </span>
                      </div>
                      <div className="text-xs">
                        {order.shippingAddress.phone}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      {order.trackingNumber && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Track Package
                        </button>
                      )}
                      <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                        <Download size={16} />
                        <span>Download Invoice</span>
                      </button>
                      <button
                        onClick={() => router.push(`/order/${order.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Summary Stats */}
        {orders.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {orders.length}
              </div>
              <div className="text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {orders.filter((o: Order) => o.status === 'delivered').length}
              </div>
              <div className="text-gray-600">Delivered</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ₹{orders.reduce((sum: number, order: Order) => sum + order.total, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-gray-600">Total Spent</div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
