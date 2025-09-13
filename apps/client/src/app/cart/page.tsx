"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { listProductsBuilder } from "@repo/api-client";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  addedAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export default function CartPage() {
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const router = useRouter();                                             
  const { state, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();

  // Fetch products from API
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        return await (listProductsBuilder.resolver as any)();
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
  });

  const loading = productsLoading;

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return;

    // If quantity becomes 0 or less, remove the item from cart
    if (newQuantity < 1) {
      await handleRemoveItem(productId);
      return;
    }
    if (newQuantity > product.stock) {
      setError(`Cannot add more than ${product.stock} items. Only ${product.stock} in stock.`);
      return;
    }

    setUpdatingItems(prev => new Set(prev).add(productId));
    setError(null);

    try {
      await updateQuantity(productId, newQuantity);
    } catch (err) {
      setError('Failed to update quantity. Please try again.');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    setError(null);

    try {
      await removeFromCart(productId);
    } catch (err) {
      setError('Failed to remove item. Please try again.');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    setError(null);
    try {
      await clearCart();
    } catch (err) {
      setError('Failed to clear cart. Please try again.');
    }
  };

  const moveToWishlist = (productId: string) => {
    // Get existing wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    
    // Check if item already in wishlist
    const isAlreadyInWishlist = wishlist.some((item: any) => item.id === productId);
    
    if (!isAlreadyInWishlist) {
      // Add to wishlist
      wishlist.push({
        id: productId,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    
    // Remove from cart
    handleRemoveItem(productId);
  };

  // Calculate totals
  const subtotal = getCartTotal(products);
  const shipping = subtotal > 5000 ? 0 : 99; // Free shipping over ₹5000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  // Show error if products failed to load
  useEffect(() => {
    if (productsError) {
      setError('Failed to load product information. Please refresh the page.');
    }
  }, [productsError]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error if API fails
  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Unable to Load Cart</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're having trouble loading your cart information. Please check your connection and try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Retry
              </button>
              <button
                onClick={() => router.push("/products")}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold inline-flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Continue Shopping</span>
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
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart ({state.items.length} items)</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
              disabled={state.isLoading}
            >
              Clear Cart
            </button>
            <button
              onClick={() => router.push("/wishlist")}
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
            >
              View Wishlist
            </button>
          </div>
        </div>

        {/* Error Message */}
        {(error || state.error) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error || state.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {subtotal > 5000 && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-green-600 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-green-800 font-medium">🎉 Congratulations!</p>
                <p className="text-green-700 text-sm">You qualify for free shipping!</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => {
              const product = products.find((p: Product) => p.id === item.productId);
              
              // Handle case where product is not found
              if (!product) {
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Product Not Found</h3>
                          <p className="text-sm text-red-600">This product may have been removed or is no longer available</p>
                          <p className="text-xs text-gray-500 mt-1">Product ID: {item.productId}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-600 hover:text-red-800 transition-colors inline-flex items-center space-x-1 text-sm"
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              }

              const isUpdating = updatingItems.has(product.id);

              return (
                <div key={item.id} className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${isUpdating ? 'opacity-60' : ''}`}>
                  {isUpdating && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 relative">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.stock < 10 && product.stock > 0 && (
                          <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                            Only {product.stock} left in stock
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="ml-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                            Out of stock
                          </span>
                        )}
                      </div>
                      
                      {/* Save for Later / Move to Wishlist */}
                      <div className="flex items-center mt-3 space-x-4">
                        <button
                          onClick={() => moveToWishlist(product.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                          disabled={isUpdating}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>Save for Later</span>
                        </button>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(product.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1 || isUpdating}
                      >
                        <Minus size={16} />
                      </button>
                      
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          if (newQuantity >= 1 && newQuantity <= product.stock) {
                            handleQuantityChange(product.id, newQuantity);
                          }
                        }}
                        className="w-16 text-center border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isUpdating}
                      />
                      
                      <button
                        onClick={() => handleQuantityChange(product.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                        disabled={item.quantity >= product.stock || isUpdating}
                      >
                        <Plus size={16} />
                      </button>
                      
                      {item.quantity >= product.stock && (
                        <span className="text-xs text-red-600 font-medium ml-2">
                          Max stock reached
                        </span>
                      )}
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        ₹{product.price.toLocaleString('en-IN')} × {item.quantity}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(product.id)}
                        className="text-red-600 hover:text-red-800 transition-colors mt-2 inline-flex items-center space-x-1 text-sm"
                        disabled={isUpdating}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({state.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      `₹${shipping.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    💡 Add ₹{(5000 - subtotal).toLocaleString('en-IN')} more for free shipping!
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <hr className="my-6" />

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={state.isLoading || state.items.length === 0 || products.some((p: Product) => state.items.some(item => item.productId === p.id && p.stock === 0))}
              >
                {state.isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <button
                onClick={() => router.push("/products")}
                className="w-full bg-white text-blue-600 border border-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Continue Shopping
              </button>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
