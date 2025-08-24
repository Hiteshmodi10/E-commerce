"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-semibold">Your profile</h1>
        <p className="mt-4 text-gray-600">
          This page is protected and redirects to /login if no session exists.
        </p>
      </div>
    </AuthGuard>
  );
}
