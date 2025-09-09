"use client"

import { useToast } from "@/hooks/use-toast"
import { ToastClose, ToastDescription, ToastTitle, ToastViewport } from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <div
            key={id}
            className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md p-6 pr-8 shadow-lg transition-all ${
              props.variant === 'destructive'
                ? 'border-l-4 border-l-red-500 bg-red-50 text-red-900'
                : 'border-l-4 border-l-green-500 bg-white'
            }`}
          >
            <div className="grid gap-1">
              {title && <ToastTitle className="text-sm font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-sm opacity-90">{description}</ToastDescription>
              )}
            </div>
            {action && (
              <button
                onClick={action.onClick}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {action.label}
              </button>
            )}
            <ToastClose className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100" />
          </div>
        )
      })}
      <ToastViewport />
    </div>
  )
}
