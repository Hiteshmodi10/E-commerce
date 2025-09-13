"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { listProductsBuilder } from "@repo/api-client";
import ProductGrid from "../../components/ProductGrid";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Timer, Zap, Gift, Star, ArrowRight } from "lucide-react";

export default function DealsPage() {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => (listProductsBuilder.resolver as any)(),
  });

  // Filter products with deals (those with originalPrice higher than current price)
  const dealsProducts = allProducts.filter((product: any) => 
    product.originalPrice && product.originalPrice > product.price
  );

  // Sort by discount percentage
  const sortedDeals = dealsProducts.sort((a: any, b: any) => {
    const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
    const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
    return discountB - discountA;
  });

  const getDiscountPercentage = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const flashDeals = sortedDeals.slice(0, 4);
  const megaSaleProducts = sortedDeals.slice(4, 8);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Zap className="h-8 w-8 text-yellow-400" />
              <span className="text-xl font-semibold">MEGA SALE</span>
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Unbeatable Deals!</h1>
            <p className="text-xl text-pink-100 mb-8">
              Save up to 70% on selected items. Limited time offers!
            </p>
            <div className="flex items-center justify-center space-x-8 text-pink-100">
              <div className="flex items-center space-x-2">
                <Timer className="h-5 w-5" />
                <span>Limited Time</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gift className="h-5 w-5" />
                <span>Up to 70% Off</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Best Sellers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Flash Deals */}
        {flashDeals.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">⚡ Flash Deals</h2>
                  <p className="text-gray-600">Grab them before they're gone!</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full">
                <Timer className="h-4 w-4" />
                <span className="text-sm font-medium">Ends in 2 days</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flashDeals.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden relative group"
                >
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{getDiscountPercentage(product.price, product.originalPrice)}%
                    </span>
                  </div>
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold text-red-600">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (product.rating || 4) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">({product.rating || 4}/5)</span>
                    </div>
                    <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mega Sale Section */}
        {megaSaleProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">🎁 Mega Sale</h2>
                  <p className="text-gray-600">Incredible savings on premium products</p>
                </div>
              </div>
              <a
                href="/search"
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {megaSaleProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden relative group"
                >
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{getDiscountPercentage(product.price, product.originalPrice)}%
                    </span>
                  </div>
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold text-purple-600">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (product.rating || 4) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">({product.rating || 4}/5)</span>
                    </div>
                    <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Deals */}
        {sortedDeals.length > 8 && (
          <section>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Deals & Offers</h2>
              <p className="text-gray-600">Don't miss out on these amazing discounts!</p>
            </div>
            
            <ProductGrid 
              viewMode="grid" 
              sortBy="price-low"
            />
          </section>
        )}

        {/* No Deals Message */}
        {sortedDeals.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals available right now</h3>
            <p className="text-gray-600 mb-6">
              Check back soon for amazing discounts and special offers!
            </p>
            <a
              href="/search"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
              <ArrowRight className="h-5 w-5 ml-2" />
            </a>
          </div>
        )}

        {/* Deal Categories */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Why Our Deals?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Timer className="h-6 w-6 text-red-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Limited Time</h4>
              <p className="text-gray-600 text-sm">
                Exclusive deals that won't last long. Grab them while you can!
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Quality Guaranteed</h4>
              <p className="text-gray-600 text-sm">
                Even with discounts, we never compromise on product quality.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Best Value</h4>
              <p className="text-gray-600 text-sm">
                Maximum savings on premium products you'll love.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
