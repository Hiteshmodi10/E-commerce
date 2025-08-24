"use client";

import React from "react";
import NiceModal from "@ebay/nice-modal-react";
import ResetPasswordModal from "./ResetPasswordModal";
import { useMutation } from "@/mutation";
import { resetPasswordBuilder } from "@repo/api-client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const { mutateAsync: sendReset } = useMutation(resetPasswordBuilder);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await sendReset({
        email,
      });
      setLoading(false);
      const maybeError = (
        res as unknown as { error?: string | { message?: string } }
      )?.error;
      if (maybeError)
        return setMessage(
          typeof maybeError === "string"
            ? maybeError
            : maybeError?.message || "Failed to send reset email"
        );
      setMessage("If an account exists, a reset email has been sent.");

      // open the modal to allow entering OTP and new password
      try {
        // use unknown-typed accessor to avoid explicit `any` in codebase
        (NiceModal as unknown as { show: (v: unknown) => void }).show(
          ResetPasswordModal
        );
      } catch {
        // ignore if nice-modal isn't installed in the environment
      }
    } catch (caught) {
      setLoading(false);
      const err = caught as unknown as {
        error?: { message?: string };
        message?: string;
      };
      setMessage(
        err?.error?.message || err?.message || "Failed to send reset email"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Reset your password
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Enter your email and we&apos;ll send you instructions to reset your
          password.
        </p>

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
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset email"}
            </button>
          </div>
        </form>

        {message && <div className="mt-4 text-sm text-gray-700">{message}</div>}
      </div>
    </div>
  );
}
