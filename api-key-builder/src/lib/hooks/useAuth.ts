'use client'

import { useEffect, useState } from 'react'
import { User } from '@/lib/store/api/authSlice'
import { sessionStorage } from '@/lib/storage/session'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = sessionStorage.getUser()
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  const isAuthenticated = !!user

  return {
    user,
    isLoading,
    isAuthenticated,
  }
} 