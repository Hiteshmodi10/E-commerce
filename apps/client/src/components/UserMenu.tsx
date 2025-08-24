"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../lib/supabaseClient";

interface User {
  email?: string;
  name?: string;
}

interface UserMenuProps {
  user: User | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/login/signup")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span>{user.email}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <button
            onClick={() => {
              setIsOpen(false);
              router.push("/profile");
            }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Profile
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              router.push("/orders");
            }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            My Orders
          </button>
          <hr className="my-1" />
          <button
            onClick={handleSignOut}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
