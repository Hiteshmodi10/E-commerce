"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import LoginForm from "../../components/auth/LoginForm";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const result = supabase?.auth?.getSession
          ? await supabase.auth.getSession()
          : { data: { session: null } };
        const session = (result as unknown as { data?: { session?: unknown } })
          ?.data?.session;
        if (!mounted) return;
        if (session) {
          try {
            router.replace(redirectTo);
          } catch {
            /* ignore */
          }
          if (typeof window !== "undefined") window.location.href = redirectTo;
        }
      } catch {
        /* ignore */
      }
    };
    check();
    return () => {
      mounted = false;
    };
  }, [router, redirectTo]);

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-50">
      <header className="flex justify-end">
        <Image alt="Logo" src="/expanded-logo.svg" height={32} width={165} />
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-3xl p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to E‑Shop</h1>
            <p className="text-gray-600">Sign in to access your cart, orders, and wishlist</p>
          </div>
          <LoginForm redirectTo={redirectTo} />
        </div>
      </main>

      <footer className="flex justify-end text-sm text-gray-500">
        <div>
          © {new Date().getFullYear()} Your Website. All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
