"use client";

import React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

export const ResetPasswordModal: React.FC = () => {
  const modal = useModal();
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Supabase does not provide OTP verify API client-side; this is placeholder logic.
      // Ideally, verify OTP on server and call supabase.auth.updateUser or similar.
      // Here we close modal to simulate success.
      setTimeout(() => {
        setLoading(false);
        modal.resolve(true);
        modal.hide();
      }, 800);
    } catch (caught) {
      setLoading(false);
      const err = caught as unknown as { message?: string };
      setMessage(err?.message || "Failed to reset password");
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Enter OTP and new password</h3>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">OTP</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded"
          />
        </div>
        {message && <div className="text-sm text-red-600">{message}</div>}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => modal.hide()}
            className="mr-2 px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

// register and export created modal so consumers call NiceModal.show(ResetPasswordModal)
const created = (
  NiceModal as unknown as { create?: (v: unknown) => unknown }
).create?.(ResetPasswordModal);

export default (created as unknown) ?? ResetPasswordModal;
