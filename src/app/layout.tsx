import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import { ToastProvider } from '@/components/ui/toast'
import { ToastProvider as CustomToastProvider } from '@/hooks/use-toast'
import ClientProviders from '@/components/ClientProviders'

export const metadata: Metadata = {
  title: 'Latest-OS - AI Relationship Companion',
  description: 'Advanced AI-powered relationship intelligence platform with AI Load Balancer, Secret Couple Loop, and comprehensive relationship enhancement features.',
  keywords: 'relationship, AI, companion, load balancer, intimacy, family, education',
  authors: [{ name: 'Latest-OS Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientProviders>
          <CustomToastProvider>
            <ToastProvider>
              {children}
              <Toaster />
            </ToastProvider>
          </CustomToastProvider>
        </ClientProviders>
      </body>
    </html>
  )
}
