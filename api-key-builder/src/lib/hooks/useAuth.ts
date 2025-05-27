'use client'

import {useEffect, useState} from 'react'
import {User} from '@/lib/store/api/authSlice'
import {sessionStorage} from '@/lib/storage/session'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUser = sessionStorage.getUser()
    console.log('Stored user:', storedUser)
    setUser(storedUser)
    setIsLoading(false)
    if (storedUser) {
      setIsAuthenticated(true)
    }
  }, [])

  const setAuthenticated = (authenticate: boolean) => {
    setIsAuthenticated(authenticate)
  }

  return {
    setAuthenticated,
    user,
    isLoading,
    isAuthenticated,
  }
} 