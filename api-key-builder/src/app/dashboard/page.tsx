'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardHeader } from './components/DashboardHeader';
import { ApiKeysTable } from './components/ApiKeysTable';
import { CreateKeyModal } from './components/CreateKeyModal';

// Create a client
const queryClient = new QueryClient();

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-8">
        <DashboardHeader onCreateClick={() => setIsCreateModalOpen(true)} />
        <ApiKeysTable />
        <CreateKeyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
          }}
        />
      </div>
    </QueryClientProvider>
  );
} 