"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  Download,
  Upload,
} from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Add Product",
      description: "Create a new product",
      href: "/admin/products?action=create",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Manage Inventory",
      description: "Update stock levels",
      href: "/admin/products",
      icon: Package,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "View Orders",
      description: "Check recent orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Manage Users",
      description: "User administration",
      href: "/admin/users",
      icon: Users,
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
    {
      title: "Export Data",
      description: "Download reports",
      href: "#",
      icon: Download,
      color: "bg-gray-500 hover:bg-gray-600",
    },
    {
      title: "Settings",
      description: "System configuration",
      href: "/admin/settings",
      icon: Settings,
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-500 mt-1">Common administrative tasks</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className={`flex-shrink-0 p-2 rounded-lg text-white ${action.color} transition-colors`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Bulk Operations</h4>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Upload className="h-4 w-4 mr-2" />
              Import Products
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}