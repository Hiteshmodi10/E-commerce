"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Package, Clock, CheckCircle, Truck, MapPin, Download, ArrowLeft } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: "1",
      orderNumber: "ESH001234",
      date: "2024-01-15",
      status: "delivered",
      total: 449.97,
      trackingNumber: "TRK123456789",
      items: [
        {
          id: "1",
          name: "Premium Wireless Headphones",
          image: "/api/placeholder/80/80",
          quantity: 1,
          price: 299.99
        },
        {
          id: "2",
          name: "Bluetooth Speaker",
          image: "/api/placeholder/80/80",
          quantity: 2,
          price: 79.99
        }
      ],
      shippingAddress: {
        fullName: "John Doe",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States"
      }
    },
    {
      id: "2",
      orderNumber: "ESH001235",
      date: "2024-01-20",
      status: "shipped",
      total: 149.99,
      trackingNumber: "TRK987654321",
      items: [
        {
          id: "3",
          name: "Designer Sunglasses",
          image: "/api/placeholder/80/80",
          quantity: 1,
          price: 149.99
        }
      ],
      shippingAddress: {
        fullName: "John Doe",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States"
      }
    },
    {
      id: "3",
      orderNumber: "ESH001236",
      date: "2024-01-22",
      status: "confirmed",
      total: 89.99,
      items: [
        {
          id: "4",
          name: "Skincare Set",
          image: "/api/placeholder/80/80",
          quantity: 1,
          price: 89.99
        }
      ],
      shippingAddress: {
        fullName: "John Doe",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States"
      }
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

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
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
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
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${order.total.toFixed(2)}
                      </div>
                      {order.trackingNumber && (
                        <div className="text-sm text-gray-600">
                          Tracking: {order.trackingNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
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
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            ${item.price.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-gray-600">Delivered</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
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
