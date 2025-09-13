import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

type SupabaseStub = {
  auth: {
    setSession: (...args: unknown[]) => Promise<unknown> | null;
    signIn: (...args: unknown[]) => Promise<unknown>;
    signOut: (...args: unknown[]) => Promise<unknown>;
    onAuthStateChange: (...args: unknown[]) => unknown;
    getSession?: () => Promise<{ data: { session: unknown | null } }>;
    verifyOtp?: (...args: unknown[]) => Promise<unknown>;
  };
  from: (table: string) => {
    insert: (
      ...args: unknown[]
    ) => Promise<{ data: unknown; error: Error | null }>;
  };
};

let supabase: SupabaseClient | SupabaseStub;

if (!url || !anonKey) {
  // Do not throw at import time in dev builds; warn so developer can set env vars
  // Provide a lightweight stub so pages that import `supabase` don't crash during dev.
  console.warn(
    "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set — exporting stub supabase client"
  );

  const stub: SupabaseStub = {
    auth: {
      async setSession() {
        // no-op in dev when not configured
        return null;
      },
      async signIn() {
        return { error: new Error("Supabase not configured") };
      },
      async signOut() {
        return { error: new Error("Supabase not configured") };
      },
      onAuthStateChange() {
        return { data: null, error: null };
      },
      async getSession() {
        return { data: { session: null } };
      },
      async verifyOtp() {
        return { error: new Error("Supabase not configured") };
      },
    },
    from: () => ({
      insert: async () => ({
        data: null,
        error: new Error("Supabase not configured"),
      }),
    }),
  } as const;

  supabase = stub;
} else {
  supabase = createClient(url, anonKey);
}

export { supabase };
export default supabase;
