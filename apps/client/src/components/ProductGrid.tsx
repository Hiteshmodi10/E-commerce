"use client";

import React from "react";
import { useQuery } from "@/query";
import { listProductsBuilder } from "@repo/api-client";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  category?: string;
  searchQuery?: string;
}

export default function ProductGrid({
  category,
  searchQuery,
}: ProductGridProps) {
  const { data, isLoading, error } = useQuery(listProductsBuilder as any);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load products</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  let filteredProducts = Array.isArray(data) ? data : [];

  // Filter by category
  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product: any) =>
        product.category?.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product: any) =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">No products found</div>
        {(category || searchQuery) && (
          <p className="text-sm text-gray-400">
            Try adjusting your filters or search terms
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
