"use client";

import { ApiKeysTable } from "./api-keys-table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ApiKeysPage() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4">API Keys</h2>
        <div className="bg-[#181C23] border border-[#23272F] rounded-lg p-8 text-gray-300">
          <ApiKeysTable />
        </div>
      </div>
    </QueryClientProvider>
  );
} 