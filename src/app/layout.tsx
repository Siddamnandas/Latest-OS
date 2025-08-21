import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./animations.css";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryProvider } from "@/lib/query-provider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leela OS - AI Relationship Companion",
  description:
    "Transform your relationship with AI-powered coaching, fair task management, and mythological wisdom for modern Indian couples.",
  keywords: [
    "Leela OS",
    "relationship app",
    "couple coaching",
    "parenting",
    "AI companion",
    "Indian couples",
  ],
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
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ErrorBoundary>
          <AuthProvider session={session}>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </ErrorBoundary>
        <Script id="sw-register" strategy="afterInteractive">
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
