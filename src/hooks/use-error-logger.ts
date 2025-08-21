'use client';

import { useCallback } from 'react';

export function useErrorLogger() {
  return useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    // Placeholder for integrating with external logging service
  }, []);
}

