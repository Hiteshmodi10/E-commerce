"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listProductsBuilder } from "@repo/api-client";
import ProductGrid from "../../../components/ProductGrid";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { ShoppingBag, Sparkles } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  
  // Convert slug back to category name (e.g., "smart-phones" -> "Electronics")
  const categoryName = categorySlug
    ?.split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => (listProductsBuilder.resolver as any)(),
  });

  // Get unique categories from products to find the actual category name
  const categories = React.useMemo(() => {
    return [...new Set(allProducts.map((product: any) => product.category))].filter(Boolean) as string[];
  }, [allProducts]);

  // Find matching category (case insensitive)
  const actualCategory = categories.find((cat: string) => 
    cat.toLowerCase().replace(/\s+/g, "-") === categorySlug?.toLowerCase()
  ) || categoryName;

  const categoryProducts = allProducts.filter((product: any) => 
    product.category?.toLowerCase() === actualCategory?.toLowerCase()
  );

  const getCategoryDescription = (category: string) => {
    const descriptions: { [key: string]: string } = {
      "Electronics": "Discover cutting-edge technology and innovative gadgets",
      "Fashion": "Trendy clothing and accessories for every style",
      "Home": "Transform your living space with our home essentials",
      "Sports": "Gear up for your active lifestyle",
      "Beauty": "Enhance your natural beauty with premium products",
      "Books": "Expand your mind with our curated book collection",
      "Toys": "Fun and educational toys for all ages"
    };
    return descriptions[category] || `Explore our ${category.toLowerCase()} collection`;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      "Electronics": "📱",
      "Fashion": "👗",
      "Home": "🏠", 
      "Sports": "⚽",
      "Beauty": "💄",
      "Books": "📚",
      "Toys": "🧸"
    };
    return icons[category] || "🛍️";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <span>/</span>
          <a href="/search" className="hover:text-blue-600 transition-colors">Categories</a>
          <span>/</span>
          <span className="text-gray-900 font-medium">{actualCategory}</span>
        </nav>
      </div>

      {/* Category Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {categories.map((cat: string) => {
              const slug = cat.toLowerCase().replace(/\s+/g, "-");
              const isActive = cat.toLowerCase() === actualCategory?.toLowerCase();
              return (
                <a
                  key={cat}
                  href={`/category/${slug}`}
                  className={`whitespace-nowrap py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categoryProducts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                All {actualCategory} Products
              </h2>
              <p className="text-gray-600">
                {categoryProducts.length} product{categoryProducts.length !== 1 ? "s" : ""}
              </p>
            </div>
            <ProductGrid category={actualCategory} viewMode="grid" />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              We don't have any products in the {actualCategory} category yet.
            </p>
            <a
              href="/search"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Browse All Products
            </a>
          </div>
        )}

        {/* Category Features */}
        {categoryProducts.length > 0 && (
          <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Why Choose Our {actualCategory}?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">✨</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Premium Quality</h4>
                <p className="text-gray-600 text-sm">
                  Carefully selected products that meet our high quality standards.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">🚚</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fast Shipping</h4>
                <p className="text-gray-600 text-sm">
                  Quick and reliable delivery to get your products to you fast.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">🛡️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Warranty</h4>
                <p className="text-gray-600 text-sm">
                  Comprehensive warranty coverage for your peace of mind.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
