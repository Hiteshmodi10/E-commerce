"use client";

import React from "react";
import {
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Users,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  rating?: number;
  createdAt?: string;
}

interface StatsCardsProps {
  products: Product[];
}

export default function StatsCards({ products }: StatsCardsProps) {
  const stats = React.useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStock = products.filter((p) => p.stock < 10 && p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const averagePrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
    const totalInventoryItems = products.reduce((sum, p) => sum + p.stock, 0);

    return {
      totalProducts,
      totalValue,
      lowStock,
      outOfStock,
      averagePrice,
      totalInventoryItems,
    };
  }, [products]);

  const cardData = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "blue",
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Inventory Value",
      value: `₹${stats.totalValue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: "green",
      change: "+18%",
      changeType: "increase" as const,
    },
    {
      title: "Total Items",
      value: stats.totalInventoryItems.toLocaleString(),
      icon: ShoppingCart,
      color: "purple",
      change: "+5%",
      changeType: "increase" as const,
    },
    {
      title: "Avg. Product Price",
      value: `₹${stats.averagePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "indigo",
      change: "+3%",
      changeType: "increase" as const,
    },
    {
      title: "Low Stock Items",
      value: stats.lowStock.toString(),
      icon: AlertTriangle,
      color: "yellow",
      change: stats.lowStock > 0 ? "Attention needed" : "All good",
      changeType: stats.lowStock > 0 ? ("decrease" as const) : ("increase" as const),
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock.toString(),
      icon: Users,
      color: "red",
      change: stats.outOfStock > 0 ? "Restock needed" : "All good",
      changeType: stats.outOfStock > 0 ? ("decrease" as const) : ("increase" as const),
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      indigo: "bg-indigo-100 text-indigo-600",
      yellow: "bg-yellow-100 text-yellow-600",
      red: "bg-red-100 text-red-600",
    };
    return colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              <div className="flex items-center mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    card.changeType === "increase"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}