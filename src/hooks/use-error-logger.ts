'use client';

import { useCallback } from 'react';
import { logger } from '@/lib/logger';

export function useErrorLogger() {
  return useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    logger.error('ErrorBoundary caught an error', error, errorInfo);
    // Placeholder for integrating with external logging service
  }, []);
}

