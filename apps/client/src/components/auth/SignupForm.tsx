"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabaseClient';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return setMessage(error.message);
    setMessage('Signup successful. Check your email for confirmation link.');
  };

  return (
    <form onSubmit={submit}>
      <h2>Create account</h2>
      <div>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
      </div>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </form>
  );
}
