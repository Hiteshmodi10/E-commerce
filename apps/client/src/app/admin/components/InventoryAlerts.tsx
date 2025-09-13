"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Package, ExternalLink } from "lucide-react";

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

interface InventoryAlertsProps {
  products: Product[];
}

export default function InventoryAlerts({ products }: InventoryAlertsProps) {
  const lowStockProducts = products.filter((p) => p.stock < 10 && p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Inventory Alerts</h3>
          <Link
            href="/admin/products"
            className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            View all products
            <ExternalLink className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="p-6">
        {outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No inventory alerts at the moment.</p>
            <p className="text-xs text-gray-400 mt-1">All products are well-stocked!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Out of Stock */}
            {outOfStockProducts.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">
                    Out of Stock ({outOfStockProducts.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {outOfStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className="flex items-center">
                        <img
                          src={product.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop"}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          0 in stock
                        </span>
                      </div>
                    </div>
                  ))}
                  {outOfStockProducts.length > 5 && (
                    <p className="text-xs text-gray-500 text-center py-2">
                      +{outOfStockProducts.length - 5} more out of stock items
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Low Stock */}
            {lowStockProducts.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">
                    Low Stock ({lowStockProducts.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <div className="flex items-center">
                        <img
                          src={product.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop"}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {product.stock} left
                        </span>
                      </div>
                    </div>
                  ))}
                  {lowStockProducts.length > 5 && (
                    <p className="text-xs text-gray-500 text-center py-2">
                      +{lowStockProducts.length - 5} more low stock items
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}