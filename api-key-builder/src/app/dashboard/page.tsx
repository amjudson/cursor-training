import { Metadata } from "next";
import { DashboardHeader } from "./components/DashboardHeader";

export const metadata: Metadata = {
  title: "API Key Management",
  description: "Manage your API keys",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <DashboardHeader />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
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
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">No API keys found</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 