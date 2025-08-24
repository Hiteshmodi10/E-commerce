"use client";
import React, { useEffect, useState } from "react";
import QueryProviders from "./QueryProviders";
import NiceModal from "@ebay/nice-modal-react";
import { usePathname, useRouter } from "next/navigation";
import supabase from "../lib/supabaseClient";

export const LayoutClient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Split public paths: auth pages should be checked so logged-in users are
    // redirected away, while asset/api paths are always allowed.
    const authPages = ["/login", "/login/signup", "/login/forgot-password"];
    const allowlistPaths = ["/_next", "/api"];

    if (allowlistPaths.some((p) => pathname?.startsWith(p))) {
      setChecking(false);
      return;
    }

    const check = async () => {
      try {
        // supabase new client exposes auth.getSession(); guard for stubs
        const result = supabase?.auth?.getSession
          ? await supabase.auth.getSession()
          : { data: { session: null } };
        const session = (result as unknown as { data?: { session?: unknown } })
          ?.data?.session;
        console.debug("[LayoutClient] session check", { pathname, session });
        if (!mounted) return;

        // If we're on an auth page and the user is signed in, redirect to root.
        if (authPages.some((p) => pathname?.startsWith(p))) {
          if (session) {
            try {
              router.replace("/");
            } catch {
              /* ignore */
            }
            if (typeof window !== "undefined") window.location.href = "/";
            return;
          }
          // allow unauthenticated users to see auth pages
          setChecking(false);
          return;
        }

        // For protected pages, if no session -> redirect to login
        if (!session) {
          try {
            router.replace("/login");
          } catch {
            /* ignore */
          }
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        } else {
          setChecking(false);
        }
      } catch (err) {
        console.debug("[LayoutClient] session check error", err);
        try {
          router.replace("/login");
        } catch {
          /* ignore */
        }
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    };

    check();

    // Subscribe to auth state changes so we stay in sync and avoid transient
    // redirects when the user signs in/out in another tab.
    let unsubscribe: (() => void) | null = null;
    try {
      const onAuthStateChange = supabase?.auth?.onAuthStateChange;
      if (typeof onAuthStateChange === "function") {
        const sub = supabase.auth.onAuthStateChange((event, session) => {
          console.debug("[LayoutClient] auth event", event, { pathname });
          if (event === "SIGNED_IN") {
            // if user signed in while on an auth page, redirect to root
            if (authPages.some((p) => pathname?.startsWith(p))) {
              try {
                router.replace("/");
              } catch {}
              if (typeof window !== "undefined") window.location.href = "/";
            } else {
              setChecking(false);
            }
          }
          if (event === "SIGNED_OUT") {
            // If signed out, ensure protected pages send to login
            if (!authPages.some((p) => pathname?.startsWith(p))) {
              try {
                router.replace("/login");
              } catch {}
              if (typeof window !== "undefined")
                window.location.href = "/login";
            }
          }
        });
        // supabase typings vary; unwrap unsubscribe safely
        if (sub) {
          const s = sub as any;
          if (s.data?.subscription?.unsubscribe) {
            unsubscribe = () => s.data.subscription.unsubscribe();
          } else if (typeof s.unsubscribe === "function") {
            unsubscribe = () => s.unsubscribe();
          } else {
            unsubscribe = null;
          }
        }
      }
    } catch (e) {
      // ignore
    }

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking session...
      </div>
    );
  }

  return (
    <NiceModal.Provider>
      <QueryProviders>{children}</QueryProviders>
    </NiceModal.Provider>
  );
};

export default LayoutClient;
