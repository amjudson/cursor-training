'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  isActive: boolean;
}

export function ApiKeysTable() {
  const [showKey, setShowKey] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: apiKeys, isLoading } = useQuery<ApiKey[]>({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const response = await fetch('/api/keys');
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });

  if (isLoading) {
    return <div data-testid="api-keys-loading">Loading...</div>;
  }

  return (
    <div data-testid="api-keys-table-container" className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <div className="overflow-x-auto">
          <table data-testid="api-keys-table" className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Key</th>
                <th className="text-left py-3 px-4">Created</th>
                <th className="text-left py-3 px-4">Last Used</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys?.length === 0 ? (
                <tr className="border-b dark:border-gray-700">
                  <td colSpan={5} className="py-3 px-4 text-center">
                    No API keys found
                  </td>
                </tr>
              ) : (
                apiKeys?.map((key) => (
                  <tr key={key.id} data-testid={`api-key-row-${key.id}`} className="border-b dark:border-gray-700">
                    <td className="py-3 px-4">{key.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {showKey === key.id ? key.key : '••••••••••••••••'}
                        </code>
                        <button
                          data-testid={`api-key-toggle-${key.id}`}
                          onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {showKey === key.id ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {key.lastUsed
                        ? new Date(key.lastUsed).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        data-testid={`api-key-delete-${key.id}`}
                        onClick={() => deleteMutation.mutate(key.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 