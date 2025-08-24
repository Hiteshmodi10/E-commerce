"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMutation } from "@/mutation";
import { createCartBuilder } from "@repo/api-client";
import supabase from "../lib/supabaseClient";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { mutateAsync: addToCart } = useMutation(createCartBuilder as any);

  const addToCartHandler = async () => {
    try {
      setIsAddingToCart(true);

      // Get current user
      let userId = null;
      try {
        if (supabase?.auth?.getSession) {
          const result = await supabase.auth.getSession();
          userId = (result as any)?.data?.session?.user?.id;
        }
      } catch (error) {
        console.error("Error getting session:", error);
      }

      if (!userId) {
        alert("Please sign in to add items to cart");
        return;
      }

      await addToCart({
        userId,
        items: [{ productId: product.id, quantity: 1 }],
      });

      // Show success feedback
      const button = document.getElementById(`add-to-cart-${product.id}`);
      if (button) {
        button.textContent = "Added!";
        button.classList.add("bg-green-600");
        setTimeout(() => {
          button.textContent = "Add to Cart";
          button.classList.remove("bg-green-600");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 hover:text-indigo-600">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {product.category}
            </span>
          </div>

          <button
            id={`add-to-cart-${product.id}`}
            onClick={addToCartHandler}
            disabled={isAddingToCart}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
