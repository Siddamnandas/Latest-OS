'use client';

import * as React from 'react';
import { useContext, createContext, useCallback, useState, ReactNode, useEffect } from 'react';

// Toast types and interfaces
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: ToastAction;
  variant?: 'default' | 'destructive';
}

interface ToastContextValue {
  toast: (props: Omit<Toast, 'id'>) => string;
  toasts: Toast[];
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Simple state management for toasts (in a real app, you'd use Zustand or similar)
let toastStore: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener([...toastStore]));
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Listen for toast updates
  useEffect(() => {
    const updateToasts = () => {
      setToasts([...toastStore]);
    };

    listeners.push(updateToasts);

    // Cleanup
    return () => {
      listeners = listeners.filter(listener => listener !== updateToasts);
    };
  }, []);

  const toast = useCallback((props: Omit<Toast, 'id'>): string => {
    const id = Math.random().toString(36).substr(2, 9);

    const newToast: Toast = {
      id,
      ...props,
      duration: props.duration ?? 4000,
    };

    toastStore.push(newToast);
    notifyListeners();

    // Auto-dismiss after the specified duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        toastStore = toastStore.filter(t => t.id !== id);
        notifyListeners();
      }, newToast.duration);
    }

    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    toastStore = toastStore.filter(t => t.id !== id);
    notifyListeners();
  }, []);

  const dismissAll = useCallback(() => {
    toastStore = [];
    notifyListeners();
  }, []);

  const value: ToastContextValue = {
    toast,
    toasts,
    dismiss,
    dismissAll,
  };

  return React.createElement(ToastContext.Provider, { value: value }, children);
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    toast: context.toast,
    dismiss: context.dismiss,
    dismissAll: context.dismissAll,
    toasts: context.toasts,
  };
}
