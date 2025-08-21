'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useErrorLogger } from '@/hooks/use-error-logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundaryInner extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-4">Please try refreshing the page.</p>
          <button
            onClick={() => location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundary({ children }: { children: ReactNode }) {
  const logError = useErrorLogger();
  return <ErrorBoundaryInner onError={logError}>{children}</ErrorBoundaryInner>;
}

