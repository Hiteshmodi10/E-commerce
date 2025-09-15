"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { listProductsBuilder } from "@repo/api-client";

interface ProductGridProps {
  category?: string;
  searchQuery?: string;
  limit?: number;
  viewMode?: 'grid' | 'list';
  sortBy?: string;
  priceRange?: { min: number; max: number };
}

// Mock products data (replace with actual API call)
const mockProducts = [];

export default function ProductGrid({
  category,
  searchQuery,
  limit,
  viewMode = 'grid',
  sortBy = 'name',
  priceRange = { min: 0, max: 1000 }
}: ProductGridProps) {
  // Fetch products from API
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => (listProductsBuilder.resolver as any)(),
  });

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let filtered = [...products];

    // Filter by category
    if (category && category !== "all") {
      filtered = filtered.filter(
        (product: any) =>
          product.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product: any) =>
          product.name?.toLowerCase().includes(query) ||
          product.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter(
        (product: any) => 
          product.price >= priceRange.min && product.price <= priceRange.max
      );
    }

    // Sort products
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt || b.id).getTime() - new Date(a.createdAt || a.id).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    // Apply limit if specified
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [products, category, searchQuery, limit, sortBy, priceRange]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading products</h3>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 mb-4">
          {(category && category !== 'all') || searchQuery 
            ? "Try adjusting your filters or search terms"
            : "No products available at the moment"
          }
        </p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
    }>
      {filteredProducts.map((product: any) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
