"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signupBuilder } from "@repo/api-client";
import { useMutation } from "@/mutation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("user");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [otp, setOtp] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const [needsVerification, setNeedsVerification] = React.useState(false);

  const { mutateAsync: signupUser } = useMutation(signupBuilder);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await signupUser({ email, password, name, role });
      setLoading(false);
      const maybeError = (
        res as unknown as { error?: string | { message?: string } }
      )?.error;
      if (maybeError)
        return setMessage(
          typeof maybeError === "string"
            ? maybeError
            : maybeError?.message || "Signup failed"
        );

      // Check if user needs email confirmation
      const responseData = res as any;
      if (responseData?.user && !responseData?.user?.email_confirmed_at) {
        setNeedsVerification(true);
        setMessage("Signup successful! Please enter the OTP sent to your email to verify your account.");
      } else {
        setMessage("Signup successful. You can now log in.");
        router.push("/login");
      }
    } catch (caught) {
      setLoading(false);
      const err = caught as unknown as {
        error?: { message?: string };
        message?: string;
      };
      setMessage(err?.error?.message || err?.message || "Signup failed");
    }
  };

  const verifyOtp = async () => {
    setVerifying(true);
    setMessage(null);
    try {
      const { data, error } = await supabase?.auth?.verifyOtp?.({
        email,
        token: otp,
        type: 'signup'
      }) as any;
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Email verified successfully! You can now log in.");
        setNeedsVerification(false);
        router.push("/login");
      }
    } catch (err: any) {
      setMessage(err?.message || "Verification failed");
    }
    setVerifying(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Create an account
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select your role. Admin role provides access to manage products and users.
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || needsVerification}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </div>
        </form>

        {needsVerification && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter the OTP sent to your email"
                required
              />
            </div>
            <div>
              <button
                onClick={verifyOtp}
                disabled={verifying || !otp}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-60"
              >
                {verifying ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        )}

        {message && <div className="mt-4 text-sm text-gray-700">{message}</div>}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
