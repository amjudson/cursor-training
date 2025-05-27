'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

interface AuthRouteProps {
  children: React.ReactNode
}

export function AuthRoute({ children }: AuthRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
} 