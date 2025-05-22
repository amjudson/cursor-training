"use client";

import { ApiKeysTable } from "./api-keys-table";
import { ToastProvider } from "@/components/toast-provider";

export default function ApiKeysPage() {
  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <div className="w-full max-w-7xl px-4">
          <ApiKeysTable />
        </div>
      </div>
    </ToastProvider>
  );
} 