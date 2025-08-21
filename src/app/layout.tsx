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
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import hiMessages from "@/messages/hi.json";
import { headers, cookies } from "next/headers";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leela OS - AI Relationship Companion",
  description: "Transform your relationship with AI-powered coaching, fair task management, and mythological wisdom for modern Indian couples.",
  keywords: ["Leela OS", "relationship app", "couple coaching", "parenting", "AI companion", "Indian couples"],
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
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  const defaultLocale = "en";
  const cookieStore = cookies();
  let locale = cookieStore.get("locale")?.value;
  if (!locale) {
    const acceptLang = headers().get("accept-language");
    locale = acceptLang?.split(",")[0].split("-")[0];
  }
  if (locale !== "en" && locale !== "hi") {
    locale = defaultLocale;
  }
  const messages = locale === "hi" ? hiMessages : enMessages;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <Script id="service-worker-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js');
              });
            }
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <LanguageSwitcher />
            {children}
          </AuthProvider>
          <Toaster />
        </NextIntlClientProvider>
        <Script id="service-worker-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js');
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
