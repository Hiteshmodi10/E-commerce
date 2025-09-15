"use client";

import React, { useState } from "react";
import { X, Package, TrendingUp, TrendingDown } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image?: string;
  stock: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
};

interface StockModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStock: number) => void;
  isLoading: boolean;
}

export default function StockModal({
  product,
  isOpen,
  onClose,
  onSave,
  isLoading,
}: StockModalProps) {
  const [newStock, setNewStock] = useState(product.stock);
  const [adjustment, setAdjustment] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract">("add");
  const [note, setNote] = useState("");

  const handleStockChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setNewStock(Math.max(0, numValue));
  };

  const handleAdjustmentChange = (value: string) => {
    setAdjustment(value);
    const adjustmentValue = parseInt(value) || 0;
    if (adjustmentType === "add") {
      setNewStock(product.stock + adjustmentValue);
    } else {
      setNewStock(Math.max(0, product.stock - adjustmentValue));
    }
  };

  const handleAdjustmentTypeChange = (type: "add" | "subtract") => {
    setAdjustmentType(type);
    const adjustmentValue = parseInt(adjustment) || 0;
    if (type === "add") {
      setNewStock(product.stock + adjustmentValue);
    } else {
      setNewStock(Math.max(0, product.stock - adjustmentValue));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newStock);
  };

  const stockDifference = newStock - product.stock;
  const stockStatus = newStock === 0 ? "Out of Stock" : newStock < 10 ? "Low Stock" : "In Stock";
  const stockStatusColor = 
    newStock === 0 ? "text-red-600" : 
    newStock < 10 ? "text-yellow-600" : 
    "text-green-600";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Update Stock</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <img
              src={product.image || "/api/placeholder/48/48"}
              alt={product.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">Current Stock: {product.stock} units</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quick Adjustment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Adjustment
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <select
                  value={adjustmentType}
                  onChange={(e) => handleAdjustmentTypeChange(e.target.value as "add" | "subtract")}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                </select>
                <input
                  type="number"
                  min="0"
                  value={adjustment}
                  onChange={(e) => handleAdjustmentChange(e.target.value)}
                  placeholder="0"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="text-sm text-gray-500">units</span>
              </div>
            </div>
          </div>

          {/* Direct Stock Input */}
          <div>
            <label htmlFor="newStock" className="block text-sm font-medium text-gray-700 mb-1">
              New Stock Level
            </label>
            <input
              type="number"
              id="newStock"
              min="0"
              value={newStock}
              onChange={(e) => handleStockChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Stock Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Stock:</span>
              <span className="text-sm font-medium">{product.stock} units</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Stock:</span>
              <span className="text-sm font-medium">{newStock} units</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Change:</span>
              <span className={`text-sm font-medium flex items-center ${
                stockDifference > 0 ? "text-green-600" : 
                stockDifference < 0 ? "text-red-600" : "text-gray-600"
              }`}>
                {stockDifference > 0 && <TrendingUp className="h-4 w-4 mr-1" />}
                {stockDifference < 0 && <TrendingDown className="h-4 w-4 mr-1" />}
                {stockDifference > 0 ? "+" : ""}{stockDifference} units
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`text-sm font-medium ${stockStatusColor}`}>
                {stockStatus}
              </span>
            </div>
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              Note (Optional)
            </label>
            <textarea
              id="note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this stock adjustment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Warning for low stock */}
          {newStock < 10 && newStock > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Package className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Low Stock Warning:</strong> This product will have low stock after this update.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warning for out of stock */}
          {newStock === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Package className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    <strong>Out of Stock:</strong> This product will be out of stock and unavailable for purchase.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Stock"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}