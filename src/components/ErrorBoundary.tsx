'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { logger } from '@/lib/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
  context?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundaryInner extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with context
    logger.error('Error boundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: this.props.context,
      level: this.props.level,
      retryCount: this.retryCount,
      timestamp: new Date().toISOString()
    });

    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      logger.info('Error boundary retry attempt', {
        retryCount: this.retryCount,
        context: this.props.context
      });
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  };

  handleReload = () => {
    logger.info('Error boundary triggered page reload', {
      context: this.props.context
    });
    window.location.reload();
  };

  handleGoHome = () => {
    logger.info('Error boundary navigation to home', {
      context: this.props.context
    });
    window.location.href = '/';
  };

  renderError() {
    const { level = 'component', context } = this.props;
    const { error } = this.state;
    const canRetry = this.retryCount < this.maxRetries;

    // Different error UIs based on error level
    switch (level) {
      case 'page':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 px-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-xl text-red-800 dark:text-red-200">
                  Page Error
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  {error?.message || 'Something went wrong while loading this page.'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {context && `Context: ${context}`}
                </p>
                <div className="flex flex-col gap-2">
                  <Button onClick={this.handleReload} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                  <Button variant="outline" onClick={this.handleGoHome} className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'section':
        return (
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800 dark:text-red-200">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Section Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-red-700 dark:text-red-300 text-sm">
                {error?.message || 'This section encountered an error.'}
              </p>
              {context && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Context: {context}
                </p>
              )}
              <div className="flex gap-2">
                {canRetry && (
                  <Button size="sm" variant="outline" onClick={this.handleRetry}>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry ({this.maxRetries - this.retryCount} left)
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={this.handleReload}>
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'component':
      default:
        return (
          <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Component Error
                </h4>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  {error?.message || 'This component failed to load.'}
                </p>
                {context && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {context}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  {canRetry && (
                    <button
                      onClick={this.handleRetry}
                      className="text-xs text-red-800 dark:text-red-200 hover:underline"
                    >
                      Retry
                    </button>
                  )}
                  <button
                    onClick={this.handleReload}
                    className="text-xs text-red-800 dark:text-red-200 hover:underline"
                  >
                    Reload
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      // Otherwise use default error UI
      return this.renderError();
    }

    return this.props.children;
  }
}

export function ErrorBoundary({
  children,
  fallback,
  onError,
  level = 'component',
  context
}: ErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Additional error logging can be added here
    onError?.(error, errorInfo);
  };

  return (
    <ErrorBoundaryInner
      fallback={fallback}
      onError={handleError}
      level={level}
      context={context}
    >
      {children}
    </ErrorBoundaryInner>
  );
}

// Specialized error boundaries for specific use cases
export function PageErrorBoundary({ children, context }: { children: ReactNode; context?: string }) {
  return (
    <ErrorBoundary level="page" context={context}>
      {children}
    </ErrorBoundary>
  );
}

export function SectionErrorBoundary({ children, context }: { children: ReactNode; context?: string }) {
  return (
    <ErrorBoundary level="section" context={context}>
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({ children, context }: { children: ReactNode; context?: string }) {
  return (
    <ErrorBoundary level="component" context={context}>
      {children}
    </ErrorBoundary>
  );
}

// Error boundary with custom fallback
export function ErrorBoundaryWithFallback({
  children,
  fallback,
  context
}: {
  children: ReactNode;
  fallback: ReactNode;
  context?: string;
}) {
  return (
    <ErrorBoundary fallback={fallback} context={context}>
      {children}
    </ErrorBoundary>
  );
}