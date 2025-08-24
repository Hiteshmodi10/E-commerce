"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabaseClient";
import { useMutation } from "@/mutation";
import { loginBuilder } from "@repo/api-client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const checkForMagicLink = async () => {
      if (!hash.includes("access_token")) return;
      setLoading(true);
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      if (accessToken && refreshToken) {
        const result = await (
          supabase.auth.setSession as unknown as (
            args: unknown
          ) => Promise<unknown>
        )({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        setLoading(false);
        const err = (result as unknown as { error?: unknown })?.error;
        if (!err) router.replace("/");
      }
    };
    checkForMagicLink();
  }, [router]);

  const { mutateAsync: loginUser } = useMutation(loginBuilder);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email, password });
      setLoading(false);
      const maybeError = (
        res as unknown as { error?: string | { message?: string } }
      )?.error;
      if (maybeError)
        return setError(
          typeof maybeError === "string"
            ? maybeError
            : maybeError.message || "Login failed"
        );
      const session = (
        res as unknown as {
          session?: { access_token?: string; refresh_token?: string };
        }
      )?.session;
      if (session) {
        await supabase.auth.setSession({
          access_token: session.access_token ?? "",
          refresh_token: session.refresh_token ?? "",
        });
        router.push("/");
      } else {
        setError("Login failed");
      }
    } catch (caught) {
      setLoading(false);
      const err = caught as unknown as {
        error?: { message?: string };
        message?: string;
      };
      setError(err?.error?.message || err?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Sign in to your account
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="/login/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/login/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
