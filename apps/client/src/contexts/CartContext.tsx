"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCartBuilder, listCartsBuilder, updateCartBuilder, deleteCartBuilder } from "@repo/api-client";

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

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: { productId: string; quantity: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ITEMS":
      return { ...state, items: action.payload };
    case "ADD_ITEM": {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: Date.now().toString(),
            productId: action.payload.productId,
            quantity: action.payload.quantity,
            addedAt: new Date().toISOString(),
          },
        ],
      };
    }
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: (products: Product[]) => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!supabase?.auth?.getSession) return null;
      const result = await (supabase.auth.getSession as any)();
      return (result as any)?.data?.session?.user || null;
    },
  });

  // Fetch cart from API
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return (listCartsBuilder.resolver as any)();
    },
    enabled: !!user?.id,
  });

  // Load cart from localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (localCart.length > 0) {
        dispatch({ type: "SET_ITEMS", payload: localCart });
      }
    }
  }, []);

  // Update local state when cart data changes for authenticated users
  useEffect(() => {
    if (user?.id && cartData && Array.isArray(cartData) && cartData.length > 0) {
      // Consolidate all cart items from multiple cart entries
      const allItems: CartItem[] = [];
      const itemMap = new Map<string, number>(); // productId -> total quantity
      
      cartData.forEach((cart: any) => {
        if (cart.items && Array.isArray(cart.items)) {
          cart.items.forEach((item: any) => {
            if (item.productId) { // Only process items with valid productId
              const existingQuantity = itemMap.get(item.productId) || 0;
              itemMap.set(item.productId, existingQuantity + (item.quantity || 1));
            }
          });
        }
      });
      
      // Convert map back to array
      itemMap.forEach((quantity, productId) => {
        allItems.push({
          id: `consolidated_${productId}`,
          productId,
          quantity,
          addedAt: new Date().toISOString(),
        });
      });
      
      dispatch({ type: "SET_ITEMS", payload: allItems });
    }
  }, [cartData, user?.id]);

  // Sync cart to localStorage for guest users
  useEffect(() => {
    if (!user?.id && typeof window !== 'undefined') {
      localStorage.setItem("cart", JSON.stringify(state.items));
    }
  }, [state.items, user?.id]);

  // Mutations
  const createCartMutation = useMutation({
    mutationFn: async (payload: any) => createCartBuilder.resolver(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async (payload: any) => updateCartBuilder.resolver(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const deleteCartMutation = useMutation({
    mutationFn: async (payload: any) => deleteCartBuilder.resolver(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const requireAuth = async (): Promise<boolean> => {
    try {
      if (!supabase?.auth?.getSession) {
        router.push("/login");
        return false;
      }
      const result = await (supabase.auth.getSession as any)();
      const user = (result as any)?.data?.session?.user;
      
      if (!user) {
        // Redirect to login with return URL
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/login");
      return false;
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      
      if (user?.id) {
        // Use API for authenticated users
        // For now, create a new cart entry since the backend seems to allow multiple carts
        // In a proper implementation, you'd want to consolidate into a single cart
        await createCartMutation.mutateAsync({
          userId: user.id,
          items: [{ productId, quantity }],
        });
      } else {
        // Handle guest users with localStorage
        dispatch({ type: "ADD_ITEM", payload: { productId, quantity } });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to add item to cart" });
      throw error; // Re-throw to let calling component handle the error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      
      if (user?.id) {
        // First remove existing cart entries for this product
        await removeFromCart(productId);
        
        // Then add the product with new quantity
        await createCartMutation.mutateAsync({
          userId: user.id,
          items: [{ productId, quantity }],
        });
      } else {
        // Handle guest users with localStorage
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to update quantity" });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      
      if (user?.id && cartData?.length > 0) {
        // Find and delete all cart entries that contain this productId
        const cartsToDelete = cartData.filter((cart: any) => 
          cart.items?.some((item: any) => item.productId === productId)
        );
        
        for (const cart of cartsToDelete) {
          await deleteCartMutation.mutateAsync({ id: cart.id });
        }
      } else {
        // Handle guest users with localStorage
        dispatch({ type: "REMOVE_ITEM", payload: productId });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to remove item" });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      
      if (user?.id && cartData?.length > 0) {
        // Delete all cart entries for the user
        for (const cart of cartData) {
          await deleteCartMutation.mutateAsync({ id: cart.id });
        }
      } else {
        // Handle guest users with localStorage
        dispatch({ type: "CLEAR_CART" });
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to clear cart" });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const getCartTotal = (products: Product[]) => {
    return state.items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
