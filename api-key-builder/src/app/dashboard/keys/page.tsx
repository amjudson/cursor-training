"use client";

import { ApiKeysTable } from "./api-keys-table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastProvider } from "@/components/toast-provider";

export default function ApiKeysPage() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="flex min-h-screen items-center">
          <div className="w-full max-w-7xl px-4">
            <ApiKeysTable />
          </div>
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
} 