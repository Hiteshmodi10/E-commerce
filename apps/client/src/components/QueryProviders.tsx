"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureApiService } from "@repo/api-client";
import supabase from "../lib/supabaseClient";

export const QueryProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [qc] = React.useState(() => new QueryClient());

  React.useEffect(() => {
    // Initialize api-client's apiService on the client using NEXT_PUBLIC_API_BASE_URL
    // `process.env.NEXT_PUBLIC_API_BASE_URL` is replaced at build time by Next.js
    const base =
      (process.env.NEXT_PUBLIC_API_BASE_URL as string) ||
      "http://localhost:3001";
    // log to help debugging which base URL the client is using
    // eslint-disable-next-line no-console
    console.info("configureApiService baseUrl:", base);

    // Provide getToken so the apiService will attach the Supabase access token
    // for authenticated requests. getToken will be called before each request
    // by the Axios interceptor configured in ApiService.
    const getToken = async () => {
      try {
        if (!supabase?.auth?.getSession) return null;
        const result = await supabase.auth.getSession();
        const token = (result as any)?.data?.session?.access_token ?? null;
        return token as string | null;
      } catch {
        return null;
      }
    };

    configureApiService({ baseUrl: base, getToken });
  }, []);
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

export default QueryProviders;
