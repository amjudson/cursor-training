"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Copy, Pencil, Trash2, KeyRound } from "lucide-react";
import { CreateKeyModal } from "./create-key-modal";
import { EditKeyModal } from "./edit-key-modal";
import { useToast } from "@/components/toast-provider";

interface ApiKey {
  id: string;
  name: string;
  type?: string;
  usage?: number;
  key: string;
}

function maskKey(key: string) {
  return key.slice(0, 9) + "-" + "*".repeat(key.length - 10);
}

export function ApiKeysTable() {
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editKey, setEditKey] = useState<{ id: string; name: string } | null>(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: apiKeys, isLoading, isError } = useQuery<ApiKey[]>({
    queryKey: ["apiKeys"],
    queryFn: async () => {
      const res = await fetch("/api/keys");
      if (!res.ok) throw new Error("Failed to fetch API keys");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete API key");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      setDeleteId(null);
      toast.show({ title: "API Key deleted", variant: "success" });
    },
    onError: () => {
      toast.show({ title: "Failed to delete API key", variant: "error" });
    },
  });

  function handleCopy(key: string, id: string) {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
    toast.show({ title: "Copied API Key to clipboard", variant: "success" });
  }

  return (
    <div className="relative bg-[#181C23] border border-[#23272F] rounded-lg p-0 overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-8 pb-2">
        <h3 className="text-lg font-semibold">API Keys</h3>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={() => setIsCreateOpen(true)}
        >
          <KeyRound size={18} /> Add Key
        </button>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-400">Failed to load API keys.</div>
        ) : (
          <table className="min-w-full text-sm mt-2">
            <thead>
              <tr className="border-b border-[#23272F] text-gray-400">
                <th className="py-3 px-6 text-left font-medium">NAME</th>
                <th className="py-3 px-6 text-left font-medium">TYPE</th>
                <th className="py-3 px-6 text-left font-medium">USAGE</th>
                <th className="py-3 px-6 text-left font-medium">KEY</th>
                <th className="py-3 px-6 text-left font-medium">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No API keys found.</td>
                </tr>
              ) : (
                apiKeys?.map((k) => (
                  <tr key={k.id} className="border-b border-[#23272F] hover:bg-[#23272F]/60 transition-colors">
                    <td className="py-3 px-6 font-medium text-white">{k.name}</td>
                    <td className="py-3 px-6">
                      <span className="bg-[#23272F] text-xs px-2 py-1 rounded font-mono uppercase">{k.type ?? "dev"}</span>
                    </td>
                    <td className="py-3 px-6">{k.usage ?? 0}</td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-[#23272F] px-2 py-1 rounded">
                          {showKeyId === k.id ? k.key : maskKey(k.key)}
                        </span>
                        <button
                          onClick={() => setShowKeyId(showKeyId === k.id ? null : k.id)}
                          className="text-gray-400 hover:text-white"
                          title={showKeyId === k.id ? "Hide" : "Show"}
                        >
                          {showKeyId === k.id ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => handleCopy(k.key, k.id)}
                          className={`text-gray-400 hover:text-white ${copiedId === k.id ? "text-green-400" : ""}`}
                          title="Copy"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex gap-3">
                        <button
                          className="text-gray-400 hover:text-blue-400"
                          title="Edit"
                          onClick={() => setEditKey({ id: k.id, name: k.name })}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-400"
                          title="Delete"
                          onClick={() => setDeleteId(k.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Create Key Modal */}
      <CreateKeyModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["apiKeys"] })}
      />
      {/* Edit Key Modal */}
      {editKey && (
        <EditKeyModal
          open={!!editKey}
          onOpenChange={(open) => {
            if (!open) setEditKey(null);
          }}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["apiKeys"] })}
          keyId={editKey.id}
          initialName={editKey.name}
        />
      )}
      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#23272F] rounded-lg p-8 max-w-sm w-full text-center">
            <h4 className="text-lg font-semibold mb-4 text-white">Delete API Key?</h4>
            <p className="mb-6 text-gray-400">Are you sure you want to delete this API key? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
                onClick={() => setDeleteId(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 