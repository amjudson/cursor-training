"use client";

import * as Toast from "@radix-ui/react-toast";
import { createContext, useContext, useState, ReactNode } from "react";

interface ToastContextType {
  show: (opts: { title: string; description?: string; variant?: "success" | "error" }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; description?: string; variant?: "success" | "error" }>({ title: "" });

  function show(opts: { title: string; description?: string; variant?: "success" | "error" }) {
    setToast(opts);
    setOpen(false);
    setTimeout(() => setOpen(true), 10);
  }

  return (
    <ToastContext.Provider value={{ show }}>
      <Toast.Provider swipeDirection="right">
        {children}
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className={`fixed bottom-6 right-6 z-[100] w-[320px] rounded-lg shadow-lg px-6 py-4 flex flex-col gap-1
            ${toast.variant === "error" ? "bg-red-700 text-white" : "bg-[#23272F] text-white"}`}
        >
          <Toast.Title className="font-semibold text-base">{toast.title}</Toast.Title>
          {toast.description && <Toast.Description className="text-sm text-gray-200">{toast.description}</Toast.Description>}
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
} 