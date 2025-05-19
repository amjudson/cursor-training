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
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-0 sm:px-4 md:px-8 lg:px-12 xl:px-20">
            <ApiKeysTable />
          </div>
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
} 