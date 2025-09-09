// 🚀 Performance Optimization Utilities

import React, { lazy, memo, useCallback, useMemo, useState, useEffect } from 'react';

// 🔄 Lazy Loading with Error Boundaries
export const lazyWithRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    try {
      const component = await componentImport();
      return component;
    } catch (error) {
      // Retry mechanism for dynamic imports
      console.warn('Lazy loading failed, retrying...', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const component = await componentImport();
      return component;
    }
  });

// 📝 Memoized Callbacks Wrapper
export const useStableCallback = (callback: (...args: any[]) => any) => {
  return useCallback(callback, []);
};

// 🔄 Memoized Values Wrapper
export const useStableValue = <T>(value: T) => {
  return useMemo(() => value, []);
};

// ⚡ Performance Monitoring Hook
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useMemo(() => performance.now(), []);

  const measureRender = useCallback(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);

    // Report to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vitals', {
        name: `${componentName}_render_time`,
        value: Math.round(renderTime),
        custom_map: { metric_value: renderTime }
      });
    }
  }, [componentName, startTime]);

  return { measureRender };
};

// 🎯 Intersection Observer Hook for Lazy Loading
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

// 💾 Cache Management
const cache = new Map<string, any>();

export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T> | T,
  ttl: number = 5 * 60 * 1000 // 5 minutes
) => {
  return useMemo(() => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }

    const data = typeof fetcher === 'function' ? (fetcher as () => T)() : fetcher;
    cache.set(key, { data, timestamp: Date.now() });

    return data;
  }, [key, ttl]);
};

// 🖼️ Image Optimization Hook
export const useOptimizedImage = (src: string, width: number, quality: number = 85) => {
  return useMemo(() => {
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      q: quality.toString(),
      f: 'webp'
    });

    return `/api/image?${params}`;
  }, [src, width, quality]);
};

// 🔄 Debounce Hook
export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Performance-focused error boundary using React 18 features
 */
export class PerformanceErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback: React.ComponentType<{ error: Error; retry?: () => void }>;
    onError?: (error: Error) => void;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.props.onError?.(error);

    // Report to error tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }

  private retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      return React.createElement(FallbackComponent, {
        error: this.state.error,
        retry: this.retry
      });
    }

    return this.props.children;
  }
}

// Type declarations
declare global {
  interface Window {
    gtag: (command: 'config' | 'event', targetId: string, options?: any) => void;
  }
}
