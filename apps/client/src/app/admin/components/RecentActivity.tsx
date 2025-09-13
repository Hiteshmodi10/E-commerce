"use client";

import React from "react";
import { Clock, Package, ShoppingCart, User, Trash2 } from "lucide-react";

export default function RecentActivity() {
  // Mock data - in a real app this would come from your API
  const activities = [
    {
      id: 1,
      type: "product_created",
      title: "New product added",
      description: "Wireless Bluetooth Headphones",
      timestamp: "2 hours ago",
      icon: Package,
      color: "text-blue-500",
    },
    {
      id: 2,
      type: "order_received",
      title: "New order received",
      description: "Order #ORD-2024-001 - ₹10,799.99",
      timestamp: "4 hours ago",
      icon: ShoppingCart,
      color: "text-green-500",
    },
    {
      id: 3,
      type: "user_registered",
      title: "New user registered",
      description: "john.doe@example.com",
      timestamp: "6 hours ago",
      icon: User,
      color: "text-purple-500",
    },
    {
      id: 4,
      type: "product_updated",
      title: "Product stock updated",
      description: "Gaming Mouse - Stock: 25 → 30",
      timestamp: "8 hours ago",
      icon: Package,
      color: "text-blue-500",
    },
    {
      id: 5,
      type: "product_deleted",
      title: "Product removed",
      description: "Old Smartphone Model",
      timestamp: "1 day ago",
      icon: Trash2,
      color: "text-red-500",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-500">
            View all
          </button>
        </div>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No recent activity.</p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== activities.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white`}
                        >
                          <activity.icon className={`h-5 w-5 ${activity.color}`} />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}