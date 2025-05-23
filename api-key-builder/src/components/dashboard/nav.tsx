'use client'

import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast-provider'
import { useLogoutMutation } from '@/lib/store/api/authSlice'

export function DashboardNav() {
  const router = useRouter()
  const { show } = useToast()
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      show({
        title: 'Success',
        description: 'Logged out successfully',
        variant: 'success',
      })
      router.push('/')
    } catch (error) {
      show({
        title: 'Error',
        description: 'Failed to logout. Please try again.',
        variant: 'error',
      })
    }
  }

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-xl font-bold">API Key Builder</span>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 