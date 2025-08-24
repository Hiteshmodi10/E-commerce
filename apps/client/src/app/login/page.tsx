"use client";

import React from 'react';
import Image from 'next/image';
import LoginForm from '../../components/auth/LoginForm';
import { Box } from '@/components/ui/Box';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Image alt="Logo" src="/expanded-logo.svg" height={32} width={165} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 680, padding: 24 }}>
          <LoginForm />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div>© {new Date().getFullYear()} Your Website. All Rights Reserved</div>
      </div>
    </div>
  );
}
