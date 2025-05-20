'use client';

interface DashboardHeaderProps {
  onCreateClick: () => void;
}

export function DashboardHeader({ onCreateClick }: DashboardHeaderProps) {
  return (
    <div data-testid="dashboard-header-container" className="flex justify-between items-center mb-8">
      <h1 data-testid="dashboard-header-title" className="text-2xl font-bold">API Key Management</h1>
      <button
        data-testid="dashboard-header-create-button"
        className="rounded-full bg-foreground text-background px-4 py-2 hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
        onClick={onCreateClick}
      >
        Create New API Key
      </button>
    </div>
  );
} 