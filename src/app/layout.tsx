64
​
65
export default async function RootLayout({
66  children,
67
}: {
68  children: React.ReactNode;
69
}) {
70  const session = await getServerSession(authOptions);
71  
72   if (!session) {
73     redirect("/api/auth/signin");
74   }
75  ​
76  const cookieStore = cookies();
77  const locale = cookieStore.get('locale')?.value || 'en';
78  
79  const messages = locale === 'hi' ? hiMessages : enMessages;
80  ​
81   return (
82     <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
83       <head>
84         <meta name="apple-mobile-web-app-capable" content="yes" />
85         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
86       </head>
87       <body>
88         <ErrorBoundary>
89           <AuthProvider session={session}>
90             <NextIntlClientProvider locale={locale} messages={messages}>
91               <QueryProvider>
92                 {children}
93                 <Toaster />
94               </QueryProvider>
95             </NextIntlClientProvider>
96           </AuthProvider>
97         </ErrorBoundary>
98         <Script
99           id="sw-register"
100           strategy="afterInteractive"
101         >
102           {`
103             if ('serviceWorker' in navigator && 'PushManager' in window) {
104               navigator.serviceWorker.register('/service-worker.js').then(async (registration) => {
105                 try {
106                   let subscription = await registration.pushManager.getSubscription();
107                   if (!subscription) {
108                     const vapidKey = '${process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''}';
109                     if (vapidKey) {
110                       const applicationServerKey = urlBase64ToUint8Array(vapidKey);
111                       subscription = await registration.pushManager.subscribe({
112                         userVisibleOnly: true,
113                         applicationServerKey,
114                       });
115                     }
116                   }
117                 } catch (err) {
118                   console.error('Push subscription failed', err);
119                 }
120               }).catch(err => console.error('Service worker registration failed', err));
121             }
122             ​
123             function urlBase64ToUint8Array(base64String) {
124               const padding = '='.repeat((4 - base64String.length % 4) % 4);
125               const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
126               const rawData = atob(base64);
127               const outputArray = new Uint8Array(rawData.length);
128               for (let i = 0; i < rawData.length; ++i) {
129                 outputArray[i] = rawData.charCodeAt(i);
130               }
131               return outputArray;
132             }
133           `}
134         </Script>
135       </body>
136     </html>
137   );
138 }