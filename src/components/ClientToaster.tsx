'use client';

import { useToast } from '@/hooks/use-toast';

export function ClientToaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all ${toast.variant === 'destructive' ? 'border-red-500 bg-red-50 text-red-900' : 'border-gray-200 bg-white'}`}
        >
          <div className="grid gap-1">
            {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
            {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
          </div>
          <button
            className="absolute right-2 top-2 rounded-md p-1 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => dismiss(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
