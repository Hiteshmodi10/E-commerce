"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import supabase from "../../lib/supabaseClient";

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
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Mock products data (replace with actual API call)
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 299.99,
      image: "/api/placeholder/300/300",
      category: "Electronics",
      stock: 15
    },
    {
      id: "2", 
      name: "Smart Fitness Watch",
      price: 199.99,
      image: "/api/placeholder/300/300",
      category: "Electronics",
      stock: 8
    },
    {
      id: "3",
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      image: "/api/placeholder/300/300", 
      category: "Fashion",
      stock: 25
    }
  ];

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      try {
        if (supabase?.auth?.getSession) {
          const result = await supabase.auth.getSession();
          const currentUser = (result as any)?.data?.session?.user;
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };

    getUser();
    setProducts(mockProducts);
    loadCartItems();
    setLoading(false);
  }, []);

  const loadCartItems = () => {
    // Load cart from localStorage (for guest users) or API (for authenticated users)
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    setCartItems(guestCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.productId === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem("guestCart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("guestCart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem("guestCart", JSON.stringify([]));
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

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

  if (cartItems.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;

              return (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
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
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.stock < 10 && (
                          <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                            Only {product.stock} left
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(product.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        disabled={item.quantity >= product.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        ${(product.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-red-600 hover:text-red-800 transition-colors mt-2 inline-flex items-center space-x-1 text-sm"
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
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    💡 Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <hr className="my-6" />

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg mb-4"
              >
                Proceed to Checkout
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
