'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // During SSR, render children without client providers
    return <>{children}</>;
  }

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
