"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import storage from "@/lib/storage";

const queryClient = new QueryClient();

if (typeof window !== "undefined") {
  const persister = createAsyncStoragePersister({ storage });
  persistQueryClient({ queryClient, persister });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

