"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";

interface WishlistItem {
  id: string;
  addedAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 299.99,
      originalPrice: 399.99,
      image: "/api/placeholder/300/300",
      category: "Electronics",
      rating: 4.8,
      stock: 15
    },
    {
      id: "2", 
      name: "Smart Fitness Watch",
      price: 199.99,
      image: "/api/placeholder/300/300",
      category: "Electronics", 
      rating: 4.6,
      stock: 8
    },
    {
      id: "3",
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      originalPrice: 39.99,
      image: "/api/placeholder/300/300", 
      category: "Fashion",
      rating: 4.4,
      stock: 25
    }
  ];

  useEffect(() => {
    setProducts(mockProducts);
    loadWishlistItems();
    setLoading(false);
  }, []);

  const loadWishlistItems = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistItems(wishlist);
  };

  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const addToCart = (productId: string) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    const existingItem = guestCart.find((item: any) => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      guestCart.push({
        id: Date.now().toString(),
        productId,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem("guestCart", JSON.stringify(guestCart));
    
    // Show success message (you can replace with toast notification)
    alert("Item added to cart!");
  };

  const moveToCart = (productId: string) => {
    addToCart(productId);
    removeFromWishlist(productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.setItem("wishlist", JSON.stringify([]));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const wishlistProducts = products.filter(product => 
    wishlistItems.some(item => item.id === product.id)
  );

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <Heart size={80} className="mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love by clicking the heart icon on any product. 
              We'll keep them safe here for you!
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button 
            onClick={() => router.push("/")}
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Wishlist</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">{wishlistItems.length} items saved</p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Wishlist Remove Button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all opacity-80 hover:opacity-100"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>

                {/* Sale Badge */}
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}

                {/* Stock Status */}
                {product.stock < 10 && (
                  <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    Only {product.stock} left
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">{product.category}</div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <div className="flex space-x-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({product.rating})</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => moveToCart(product.id)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart size={18} />
                    <span>Move to Cart</span>
                  </button>
                  <button
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="w-full bg-white text-blue-600 border border-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <div key={`rec-${product.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="text-lg font-bold text-gray-900">${product.price}</div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
