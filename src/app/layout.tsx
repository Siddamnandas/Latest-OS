31   authors: [{ name: "Leela OS Team" }],
32   openGraph: {
33     title: "Leela OS - AI Relationship Companion",
34     description: "Transform your relationship with AI-powered coaching and mythological wisdom",
35     url: "https://leelaos.com",
36     siteName: "Leela OS",
37     type: "website",
38   },
39   twitter: {
40     card: "summary_large_image",
41     title: "Leela OS - AI Relationship Companion",
42     description: "Transform your relationship with AI-powered coaching and mythological wisdom",
43   },
44   appleWebApp: {
45     capable: true,
46     statusBarStyle: "default",
47     title: "Leela OS",
48   },
49   manifest: "/manifest.json",
50 };
51 ​
52 export const viewport: Viewport = {
53   width: "device-width",
54   initialScale: 1,
55 };
56 ​
57 export default async function RootLayout({
58   children,
59 }: {
60   children: React.ReactNode;
61 }) {
62   const session = await getServerSession(authOptions);
63   if (!session) {
64     redirect("/api/auth/signin");
65   }
66 ​
67   const cookieStore = cookies();
68   const locale = cookieStore.get('locale')?.value || 'en';
69   
70   const messages = locale === 'hi' ? hiMessages : enMessages;
71   
72   const themeScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;
73 ​
74   return (
75     <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
76       <head>
77         <meta name="apple-mobile-web-app-capable" content="yes" />
78         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
79         <Script
80           id="theme-script"
81           strategy="beforeInteractive"
82         >
83           {themeScript}
84         </Script>
85       </head>
86       <body>
87         <ErrorBoundary>
88           <AuthProvider session={session}>
89             <NextIntlClientProvider locale={locale} messages={messages}>
90               <QueryProvider>
91                 {children}
92                 <Toaster />
93               </QueryProvider>
94             </NextIntlClientProvider>
95           </AuthProvider>
96         </ErrorBoundary>
97         <Script
98           id="sw-register"
99           strategy="afterInteractive"
100         >
101           {`
102             if ('serviceWorker' in navigator && 'PushManager' in window) {
103               navigator.serviceWorker.register('/service-worker.js').then(async (registration) => {
104                 try {
105                   let subscription = await registration.pushManager.getSubscription();
106                   if (!subscription) {
107                     const vapidKey = '${process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''}';
108                     if (vapidKey) {
109                       const applicationServerKey = urlBase64ToUint8Array(vapidKey);
110                       subscription = await registration.pushManager.subscribe({
111                         userVisibleOnly: true,
112                         applicationServerKey,
113                       });
114                     }
115                   }
116                 } catch (err) {
117                   console.error('Push subscription failed', err);
118                 }
119               }).catch(err => console.error('Service worker registration failed', err));
120             }
121             ​
122             function urlBase64ToUint8Array(base64String) {
123               const padding = '='.repeat((4 - base64String.length % 4) % 4);
124               const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
125               const rawData = atob(base64);
126               const outputArray = new Uint8Array(rawData.length);
127               for (let i = 0; i < rawData.length; ++i) {
128                 outputArray[i] = rawData.charCodeAt(i);
129               }
130               return outputArray;
131             }
132           `}
133         </Script>
134       </body>
135     </html>
136   );
137 }