"use client";

import React from 'react';
import ForgotPasswordForm from '../../../components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
