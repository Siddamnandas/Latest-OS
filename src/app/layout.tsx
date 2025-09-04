import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: {
    default: "Leela OS - AI Relationship Companion",
    template: "%s | Leela OS",
  },
  description: "Transform your relationship with AI-powered coaching and mythological wisdom",
  keywords: ["AI relationship coach", "couples therapy", "relationship advice", "marriage counseling", "Indian culture", "mythology"],
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // DEVELOPMENT MODE: Bypass session authentication
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const session = isDevelopment ? { user: { name: 'Development User', email: 'dev@example.com' } } : await getServerSession(authOptions);

  if (!session && !isDevelopment) {
    redirect("/api/auth/signin");
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'en';
  
  const themeScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
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
          <AuthProvider session={session}>
            <QueryProvider>
              {children}
              <Toaster />
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
