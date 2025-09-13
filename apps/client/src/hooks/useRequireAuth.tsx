"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../lib/supabaseClient";

export const useRequireAuth = (requireAdmin: boolean = false) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const maybeGet = (
          supabase as unknown as {  
            auth?: { getSession?: () => Promise<unknown> };
          }
        )?.auth?.getSession;
        const result = maybeGet
          ? await maybeGet.call((supabase as unknown as { auth: unknown }).auth)
          : { data: { session: null } };
        if (!mounted) return;
        
        const session = (result as unknown as { data?: { session?: any } })
          ?.data?.session;
        
        if (!session) {
          router.replace("/login");
        } else {
          const userData = session.user;
          setUser(userData);
          
          // Check if admin role is required
          if (requireAdmin) {
            const userRole = userData?.user_metadata?.role || 'user';
            if (userRole !== 'admin') {
              router.replace("/"); // Redirect to home if not admin
              return;
            }
          }
          
          setLoading(false);
        }
      } catch {
        router.replace("/login");
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, [router, requireAdmin]);

  return { loading, user, isLoading: loading };
};

export default useRequireAuth;
