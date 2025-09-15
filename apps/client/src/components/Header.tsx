"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";
import supabase from "../lib/supabaseClient";
import { useCart } from "../contexts/CartContext";
import { Search, ShoppingCart, Heart, Menu, X, Phone, MapPin } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const { getCartCount } = useCart();

  useEffect(() => {
    // Get current user session
    const getUser = async () => {
      try {
        if (supabase?.auth?.getSession) {
          const result = await supabase.auth.getSession();
          const user = (result as any)?.data?.session?.user || null;
          setUser(user);
        }
      } catch (error) {
        setUser(null);
      }
    };

    getUser();

    // Listen for auth changes
    if (supabase?.auth?.onAuthStateChange) {
      const subscription = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
      });
      const unsubscribe =
        (subscription as any)?.data?.subscription?.unsubscribe || (() => {});
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    // Load wishlist count from localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistCount(wishlist.length);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      searchRef.current?.blur();
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone size={14} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>Free shipping on orders over ₹5,000</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/track-order" className="hover:text-gray-300 transition-colors">
                Track Order
              </Link>
              <Link href="/help" className="hover:text-gray-300 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              E‑Shop
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full pl-4 pr-12 py-3 border-2 rounded-lg transition-all ${
                    isSearchFocused 
                      ? "border-blue-500 ring-2 ring-blue-200" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-4 flex items-center bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Navigation Icons */}
            <nav className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/products"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Products
                </Link>
                <Link
                  href="/search"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Categories
                </Link>
                <Link
                  href="/deals"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Deals
                </Link>
                {user && user.user_metadata?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    Admin
                  </Link>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                title="Wishlist"
              >
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart size={24} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <UserMenu user={user} />

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </nav>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden mt-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/products"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/search"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/deals"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
              {user && user.user_metadata?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/track-order"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Order
              </Link>
              <Link
                href="/help"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Help & Support
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Category Navigation Bar */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-8 overflow-x-auto">
            <Link
              href="/category/electronics"
              className="whitespace-nowrap text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Electronics
            </Link>
            <Link
              href="/category/fashion"
              className="whitespace-nowrap text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Fashion
            </Link>
            <Link
              href="/category/home"
              className="whitespace-nowrap text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home & Garden
            </Link>
            <Link
              href="/category/sports"
              className="whitespace-nowrap text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sports & Outdoors
            </Link>
            <Link
              href="/category/books"
              className="whitespace-nowrap text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Books
            </Link>
            <Link
              href="/category/toys"
              className="whitespace-nowrap text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Toys & Games
            </Link>
            <Link
              href="/category/health"
              className="whitespace-nowrap text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Health & Beauty
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
