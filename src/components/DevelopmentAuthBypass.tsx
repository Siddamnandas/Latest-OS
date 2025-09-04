'use client';

import { useEffect } from 'react';

export function DevelopmentAuthBypass() {
  useEffect(() => {
    // Check if we're in development environment
    const isDevelopment =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
       window.location.hostname === '127.0.0.1' ||
       process.env.NODE_ENV === 'development');

    // If in development, automatically set authentication as bypassed
    if (isDevelopment) {
      console.log('🔓 Development Mode: Authentication bypassed silently');
      // Set a flag to indicate auth is bypassed (can be checked by other components)
      if (typeof window !== 'undefined') {
        localStorage.setItem('dev_skip_auth', 'true');
        localStorage.setItem('bypass_silent_mode', 'true');
      }
    }
  }, []);

  // Return null - no modal, just silent bypass
  return null;
}
