'use client'

import { useRouter } from 'next/navigation'
import { useLoginMutation } from '@/lib/store/api/authSlice'
import { LoginRequest } from '@/lib/store/api/authSlice'
import {sessionStorage} from '@/lib/storage/session'

export function useLogin() {
  const router = useRouter()
  const [login, { isLoading, error }] = useLoginMutation()

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      const result = await login(credentials).unwrap()
      router.push('/')
      console.log('Login successful:', result.user)
    } catch (error) {
      // Error is handled by the mutation
      console.error('Login failed:', error)
    }
  }

  const handleLogout = () => {
    sessionStorage.clear()
  }

  return {
    logout: handleLogout,
    login: handleLogin,
    isLoading,
    error,
  }
} 