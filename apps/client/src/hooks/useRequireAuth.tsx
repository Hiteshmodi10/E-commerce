"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../lib/supabaseClient";

export const useRequireAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
        const session = (result as unknown as { data?: { session?: unknown } })
          ?.data?.session;
        if (!session) {
          router.replace("/login");
        } else {
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
  }, [router]);

  return { loading };
};

export default useRequireAuth;
