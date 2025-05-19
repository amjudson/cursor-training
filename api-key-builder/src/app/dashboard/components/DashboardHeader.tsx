'use client';

import { useRouter } from 'next/navigation';

export function DashboardHeader() {
  const router = useRouter();

  const handleCreateKey = () => {
    // TODO: Implement create new API key
    console.log('Create new API key clicked');
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">API Key Management</h1>
      <button
        className="rounded-full bg-foreground text-background px-4 py-2 hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
        onClick={handleCreateKey}
      >
        Create New API Key
      </button>
    </div>
  );
} 