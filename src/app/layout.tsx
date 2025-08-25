import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/query-provider";
import { AuthProvider } from "@/lib/auth-context";
import { UpdateNotifier } from "@/lib/update-notifier";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import React from "react";

const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Inter({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Leela OS - AI Relationship Companion",
  description: "Transform your relationship with AI-powered coaching and mythological wisdom",
  authors: [{ name: "Leela OS Team" }],
  openGraph: {
    title: "Leela OS - AI Relationship Companion",
    description: "Transform your relationship with AI-powered coaching and mythological wisdom",
    url: "https://leelaos.com",
    siteName: "Leela OS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leela OS - AI Relationship Companion",
    description: "Transform your relationship with AI-powered coaching and mythological wisdom",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Leela OS",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  
>>>>>>> a802de832ecf0303d3f0d22f51e388794e994d46
}) {
  
=======
  
>>>>>>> a802de832ecf0303d3f0d22f51e388794e994d46
  const themeScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <Script
          id="theme-script"
          strategy="beforeInteractive"
        >
          {themeScript}
        </Script>
      </head>
      <body>
        <ErrorBoundary>
          <AuthProvider>
                <UpdateNotifier />
                {children}
                <Toaster />
>>>>>>> a802de832ecf0303d3f0d22f51e388794e994d46
            <QueryProvider>
              <UpdateNotifier />
              {children}
              <Toaster />
=======
                <UpdateNotifier />
                {children}
                <Toaster />
>>>>>>> a802de832ecf0303d3f0d22f51e388794e994d46
            </QueryProvider>
          </AuthProvider>
        </ErrorBoundary>
        <Script
          id="sw-register"
          strategy="afterInteractive"
        >
          {`
            if ('serviceWorker' in navigator && 'PushManager' in window) {
              navigator.serviceWorker.register('/service-worker.js').then(async (registration) => {
                try {
                  let subscription = await registration.pushManager.getSubscription();
                  if (!subscription) {
                    const vapidKey = '${process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''}';
                    if (vapidKey) {
                      const applicationServerKey = urlBase64ToUint8Array(vapidKey);
                      subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey,
                      });
                    }
                  }
                } catch (err) {
                  console.error('Push subscription failed', err);
                }
              }).catch(err => console.error('Service worker registration failed', err));
            }

            function urlBase64ToUint8Array(base64String) {
              const padding = '='.repeat((4 - base64String.length % 4) % 4);
              const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
              const rawData = atob(base64);
              const outputArray = new Uint8Array(rawData.length);
              for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
              }
              return outputArray;
            }
          `}
        </Script>
      </body>
    </html>
  );
}