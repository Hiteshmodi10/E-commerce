"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";
import supabase from "../lib/supabaseClient";
import { useQuery } from "@/query";
import { listCartsBuilder } from "@repo/api-client";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Get cart data for current user
  const { data: cartData } = useQuery(listCartsBuilder);

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
    // Calculate cart count
    if (cartData && Array.isArray(cartData)) {
      const totalItems = cartData.reduce((sum: number, cart: any) => {
        return sum + (cart.items?.length || 0);
      }, 0);
      setCartCount(totalItems);
    }
  }, [cartData]);

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            E‑Shop
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const query = (e.target as HTMLInputElement).value;
                    if (query.trim()) {
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                    }
                  }
                }}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Products
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-sm text-gray-700 hover:text-indigo-600 transition-colors flex items-center"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v0a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="ml-1">Cart</span>
            </Link>

            <UserMenu user={user} />
          </nav>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <input
            type="search"
            placeholder="Search products..."
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = (e.target as HTMLInputElement).value;
                if (query.trim()) {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                }
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}
