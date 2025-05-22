"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Pencil, Trash2, KeyRound } from "lucide-react";
import { CreateKeyModal } from "./create-key-modal";
import { EditKeyModal } from "./edit-key-modal";
import { useToast } from "@/components/toast-provider";
import { useGetApiKeysQuery, useDeleteApiKeyMutation } from "@/lib/store/api/apiSlice";

export function ApiKeysTable() {
  const [showKeyId, setShowKeyId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editKey, setEditKey] = useState<{ id: number; name: string } | null>(null);
  const toast = useToast();

  const { data: apiKeys, isLoading, isError } = useGetApiKeysQuery();
  const [deleteApiKey] = useDeleteApiKeyMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteApiKey(id).unwrap();
      setDeleteId(null);
      toast.show({ title: "API Key deleted", variant: "success" });
    } catch {
      toast.show({ title: "Failed to delete API key", variant: "error" });
    }
  };

  function handleCopy(key: string, id: number) {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
    toast.show({ title: "Copied API Key to clipboard", variant: "success" });
  }

  if (isLoading) {
    return <div data-testid="api-keys-loading-state" className="p-8 text-center text-gray-400">Loading...</div>;
  }

  if (!apiKeys || apiKeys.length === 0) {
    return (
      <div data-testid="api-keys-container" className="relative bg-[#181C23] border border-[#23272F] rounded-lg p-0 overflow-hidden">
        <div className="flex items-center justify-between px-8 pt-8 pb-2">
          <h3 data-testid="api-keys-title" className="text-lg font-semibold">API Keys</h3>
          <button
            data-testid="api-keys-add-button"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            onClick={() => setIsCreateOpen(true)}
          >
            <KeyRound size={18} /> Add Key
          </button>
        </div>
        <div className="p-8 text-center text-gray-400">
          {isError ? "Failed to load API keys." : "No API keys found."}
        </div>
        <CreateKeyModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={() => {
            setIsCreateOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div data-testid="api-keys-container" className="relative bg-[#181C23] border border-[#23272F] rounded-lg p-0 overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-8 pb-2">
        <h3 data-testid="api-keys-title" className="text-lg font-semibold">API Keys</h3>
        <button
          data-testid="api-keys-add-button"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={() => setIsCreateOpen(true)}
        >
          <KeyRound size={18} /> Add Key
        </button>
      </div>

      <div className="overflow-x-auto">
        <table data-testid="api-keys-table" className="min-w-full text-sm mt-2">
          <thead>
            <tr className="border-b border-[#23272F] text-gray-400">
              <th data-testid="api-keys-header-name" className="py-3 px-6 text-left font-medium">NAME</th>
              <th data-testid="api-keys-header-key" className="py-3 px-6 text-left font-medium">KEY</th>
              <th data-testid="api-keys-header-created" className="py-3 px-6 text-left font-medium">CREATED</th>
              <th data-testid="api-keys-header-options" className="py-3 px-6 text-left font-medium">OPTIONS</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys?.length === 0 ? (
              <tr>
                <td colSpan={4} data-testid="api-keys-empty-message" className="py-8 text-center text-gray-400">No API keys found.</td>
              </tr>
            ) : (
              apiKeys?.map((key) => (
                <tr key={key.id} data-testid={`api-keys-row-${key.id}`} className="border-b border-[#23272F] hover:bg-[#23272F]/60 transition-colors">
                  <td data-testid={`api-keys-name-${key.id}`} className="py-3 px-6 font-medium text-white">{key.name}</td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-2">
                      <span data-testid={`api-keys-key-value-${key.id}`} className="font-mono bg-[#23272F] px-2 py-1 rounded">
                        {showKeyId === key.id ? key.key : `${key.key.split('-')[0]}-••••••••••••••••`}
                      </span>
                      <button
                        data-testid={`api-keys-toggle-visibility-${key.id}`}
                        onClick={() => setShowKeyId(showKeyId === key.id ? null : key.id)}
                        className="text-gray-400 hover:text-white"
                        title={showKeyId === key.id ? "Hide" : "Show"}
                      >
                        {showKeyId === key.id ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        data-testid={`api-keys-copy-button-${key.id}`}
                        onClick={() => handleCopy(key.key, key.id)}
                        className={`text-gray-400 hover:text-white ${copiedId === key.id ? "text-green-400" : ""}`}
                        title="Copy"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </td>
                  <td data-testid={`api-keys-created-${key.id}`} className="py-3 px-6 text-gray-300">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex gap-3">
                      <button
                        data-testid={`api-keys-edit-button-${key.id}`}
                        className="text-gray-400 hover:text-blue-400"
                        title="Edit"
                        onClick={() => setEditKey({ id: key.id, name: key.name })}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        data-testid={`api-keys-delete-button-${key.id}`}
                        className="text-gray-400 hover:text-red-400"
                        title="Delete"
                        onClick={() => setDeleteId(key.id)}
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
      </div>

      <CreateKeyModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => {
          setIsCreateOpen(false);
        }}
      />

      {editKey && (
        <EditKeyModal
          open={!!editKey}
          onOpenChange={(open) => !open && setEditKey(null)}
          keyId={editKey.id}
          initialName={editKey.name}
          onSuccess={() => {
            setEditKey(null);
          }}
        />
      )}

      {deleteId && (
        <div data-testid="api-keys-delete-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div data-testid="api-keys-delete-modal-content" className="bg-[#23272F] rounded-lg p-8 max-w-sm w-full text-center">
            <h4 data-testid="api-keys-delete-modal-title" className="text-lg font-semibold mb-4 text-white">Delete API Key?</h4>
            <p data-testid="api-keys-delete-modal-message" className="mb-6 text-gray-400">Are you sure you want to delete this API key? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                data-testid="api-keys-delete-modal-cancel"
                className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                data-testid="api-keys-delete-modal-confirm"
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 