"use client";

import React from 'react';
import supabase from '../../lib/supabaseClient';

export default function ForgotPasswordForm() {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login' });
    setLoading(false);
    if (error) return setMessage(error.message);
    setMessage('If an account exists, a reset email has been sent.');
  };

  return (
    <form onSubmit={submit}>
      <h2>Reset Password</h2>
      <div>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset email'}</button>
      </div>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </form>
  );
}
