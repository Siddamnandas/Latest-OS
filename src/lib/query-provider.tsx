"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { io, Socket } from "socket.io-client";
import storage from "@/lib/storage";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      // Generic optimistic update handling
      onMutate: async (variables: any) => {
        const { queryKey, updater } = variables || {};
        if (!queryKey) return;
        await queryClient.cancelQueries({ queryKey });
        const previous = queryClient.getQueryData(queryKey);
        if (typeof updater === "function") {
          queryClient.setQueryData(queryKey, updater);
        } else if (updater !== undefined) {
          queryClient.setQueryData(queryKey, updater);
        }
        return { queryKey, previous };
      },
      onError: (_err, _vars, context: any) => {
        if (context?.queryKey) {
          queryClient.setQueryData(context.queryKey, context.previous);
        }
      },
      onSuccess: (data, _vars, context: any) => {
        if (context?.queryKey) {
          queryClient.setQueryData(context.queryKey, data);
        }
      },
    },
  },
});

let socket: Socket | undefined;

if (typeof window !== "undefined") {
  const persister = createAsyncStoragePersister({ storage });
  persistQueryClient({ queryClient, persister });

  socket = io({ path: "/api/socketio" });
  socket.onAny((event) => {
    const [model, action] = event.split(":");
    if (["create", "update", "delete"].includes(action)) {
      queryClient.invalidateQueries({ queryKey: [model] });
    }
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

