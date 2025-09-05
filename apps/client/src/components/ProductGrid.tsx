"use client";

import React, { useMemo } from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  category?: string;
  searchQuery?: string;
  limit?: number;
  viewMode?: 'grid' | 'list';
  sortBy?: string;
  priceRange?: { min: number; max: number };
}

// Mock products data (replace with actual API call)
const mockProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "/api/placeholder/300/300",
    category: "Electronics",
    rating: 4.8,
    stock: 15,
    tags: ["wireless", "noise-cancelling", "premium"]
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 199.99,
    image: "/api/placeholder/300/300",
    category: "Electronics",
    rating: 4.6,
    stock: 8,
    tags: ["fitness", "smartwatch", "health"]
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image: "/api/placeholder/300/300",
    category: "Fashion",
    rating: 4.4,
    stock: 25,
    tags: ["organic", "cotton", "casual"]
  },
  {
    id: "4",
    name: "Professional Camera Lens",
    price: 899.99,
    image: "/api/placeholder/300/300",
    category: "Electronics",
    rating: 4.9,
    stock: 5,
    tags: ["photography", "professional", "lens"]
  },
  {
    id: "5",
    name: "Ergonomic Office Chair",
    price: 349.99,
    originalPrice: 449.99,
    image: "/api/placeholder/300/300",
    category: "Home",
    rating: 4.5,
    stock: 12,
    tags: ["ergonomic", "office", "comfort"]
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    image: "/api/placeholder/300/300",
    category: "Electronics",
    rating: 4.3,
    stock: 30,
    tags: ["bluetooth", "portable", "speaker"]
  },
  {
    id: "7",
    name: "Designer Sunglasses",
    price: 149.99,
    image: "/api/placeholder/300/300",
    category: "Fashion",
    rating: 4.7,
    stock: 18,
    tags: ["designer", "sunglasses", "fashion"]
  },
  {
    id: "8",
    name: "Coffee Maker",
    price: 129.99,
    originalPrice: 179.99,
    image: "/api/placeholder/300/300",
    category: "Home",
    rating: 4.2,
    stock: 22,
    tags: ["coffee", "kitchen", "appliance"]
  },
  {
    id: "9",
    name: "Gaming Mechanical Keyboard",
    price: 159.99,
    image: "/api/placeholder/300/300",
    category: "Electronics",
    rating: 4.8,
    stock: 14,
    tags: ["gaming", "mechanical", "keyboard"]
  },
  {
    id: "10",
    name: "Yoga Mat Premium",
    price: 49.99,
    originalPrice: 69.99,
    image: "/api/placeholder/300/300",
    category: "Sports",
    rating: 4.6,
    stock: 35,
    tags: ["yoga", "fitness", "exercise"]
  },
  {
    id: "11",
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    image: "/api/placeholder/300/300",
    category: "Home",
    rating: 4.4,
    stock: 50,
    tags: ["stainless steel", "water bottle", "eco-friendly"]
  },
  {
    id: "12",
    name: "Wireless Charging Pad",
    price: 39.99,
    originalPrice: 59.99,
    image: "/api/placeholder/300/300",
    category: "Electronics",
    rating: 4.1,
    stock: 28,
    tags: ["wireless", "charging", "phone"]
  },
  {
    id: "13",
    name: "Running Shoes",
    price: 119.99,
    originalPrice: 149.99,
    image: "/api/placeholder/300/300",
    category: "Sports",
    rating: 4.5,
    stock: 20,
    tags: ["running", "shoes", "athletic"]
  },
  {
    id: "14",
    name: "Skincare Set",
    price: 89.99,
    image: "/api/placeholder/300/300",
    category: "Beauty",
    rating: 4.7,
    stock: 15,
    tags: ["skincare", "beauty", "organic"]
  },
  {
    id: "15",
    name: "Building Blocks Set",
    price: 34.99,
    originalPrice: 44.99,
    image: "/api/placeholder/300/300",
    category: "Toys",
    rating: 4.8,
    stock: 40,
    tags: ["building", "educational", "kids"]
  },
  {
    id: "16",
    name: "Mystery Novel Collection",
    price: 19.99,
    image: "/api/placeholder/300/300",
    category: "Books",
    rating: 4.3,
    stock: 25,
    tags: ["mystery", "novel", "fiction"]
  }
];

export default function ProductGrid({
  category,
  searchQuery,
  limit,
  viewMode = 'grid',
  sortBy = 'name',
  priceRange = { min: 0, max: 1000 }
}: ProductGridProps) {

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Filter by category
    if (category && category !== "all") {
      products = products.filter(
        (product: any) =>
          product.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (product: any) =>
          product.name?.toLowerCase().includes(query) ||
          product.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    if (priceRange) {
      products = products.filter(
        (product: any) => 
          product.price >= priceRange.min && product.price <= priceRange.max
      );
    }

    // Sort products
    products.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.id).getTime() - new Date(a.id).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    // Apply limit if specified
    if (limit && limit > 0) {
      products = products.slice(0, limit);
    }

    return products;
  }, [category, searchQuery, limit, sortBy, priceRange]);

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
