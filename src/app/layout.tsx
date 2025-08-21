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
import { initSentry } from "@/lib/sentry";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import hiMessages from "@/messages/hi.json";
import { headers, cookies } from "next/headers";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryProvider } from "@/lib/query-provider";
import { UpdateNotifier } from "@/lib/update-notifier";

initSentry();

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
    title: "Leela OS",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();
  const locale = cookieStore.get('locale')?.value || 'en';
  
  const messages = locale === 'hi' ? hiMessages : enMessages;

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Leela OS" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
        <ErrorBoundary>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider session={session}>
              <QueryProvider>
                <div className="fixed top-4 right-4 z-50">
                  <LanguageSwitcher />
                </div>
                {children}
                <UpdateNotifier />
                <Toaster />
              </QueryProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </ErrorBoundary>
        
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_TRACKING_ID');
          `}
        </Script>
      </body>
    </html>
  );
}