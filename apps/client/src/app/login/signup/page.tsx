"use client";

import React from "react";
import SignupForm from "../../../components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div style={{ padding: 24, minHeight: "100vh" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <SignupForm />
      </div>
    </div>
  );
}
