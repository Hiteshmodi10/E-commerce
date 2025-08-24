"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  listCartsBuilder,
  updateCartBuilder,
  deleteCartBuilder,
} from "@repo/api-client";
import { listProductsBuilder } from "@repo/api-client";
import supabase from "../../lib/supabaseClient";
import { useQuery } from "@/query";
import { useMutation } from "@/mutation";

export default function CartPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      try {
        if (supabase?.auth?.getSession) {
          const result = await supabase.auth.getSession();
          const currentUser = (result as any)?.data?.session?.user;
          setUser(currentUser);

          if (!currentUser) {
            router.push("/login");
          }
        }
      } catch (error) {
        router.push("/login");
      }
    };
    getUser();
  }, [router]);

  const {
    data: cartData,
    isLoading: cartLoading,
    refetch: refetchCart,
  } = useQuery(listCartsBuilder);

  const { data: productsData } = useQuery(listProductsBuilder);

  const updateCartMutation = useMutation(updateCartBuilder);

  const removeFromCartMutation = useMutation({
    mutationFn: async (cartId: string) => {
      const response = await fetch(`/api/carts/${cartId}`, {
        method: "DELETE",
        credentials: "include",
      });
      return response.json();
    },
    onSuccess: () => refetchCart(),
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p>Please sign in to view your cart.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const cartItems = Array.isArray(cartData) ? cartData : [];
  const products = Array.isArray(productsData) ? productsData : [];

  // Calculate total
  const total = cartItems.reduce((sum: number, item: any) => {
    const product = products.find((p: any) => p.id === item.productId);
    return sum + (product?.price || 0) * (item.quantity || 0);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {cartItems.map((item: any) => {
                const product = products.find(
                  (p: any) => p.id === item.productId
                );
                if (!product) return null;

                return (
                  <div
                    key={item.id}
                    className="flex items-center p-6 border-b last:border-b-0"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg mr-4 flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 mr-4">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {product.category}
                      </p>
                      <p className="text-lg font-bold mt-1">${product.price}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateCartMutation.mutate({
                              cartId: item.id,
                              quantity: item.quantity - 1,
                            });
                          }
                        }}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => {
                          updateCartMutation.mutate({
                            cartId: item.id,
                            quantity: item.quantity + 1,
                          });
                        }}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCartMutation.mutate(item.id)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span>${(total * 1.1).toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
