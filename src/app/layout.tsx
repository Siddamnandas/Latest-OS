import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
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
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  const themeScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <AuthProvider session={session}>
          <ErrorBoundary>
            <QueryProvider>{children}</QueryProvider>
            <Toaster />
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
