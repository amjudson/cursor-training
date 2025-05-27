import { createApi, fetchBaseQuery, BaseQueryApi } from '@reduxjs/toolkit/query/react'
import { sessionStorage } from '@/lib/storage/session'
import { redirect } from 'next/navigation'

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface RegisterResponse {
  message: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RefreshTokenResponse {
  token: string
}

const baseQuery = fetchBaseQuery({ 
  baseUrl: 'http://localhost:5293/api',
  prepareHeaders: (headers) => {
    const token = sessionStorage.getToken()
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (
  args: string | { url: string; method: string; body?: unknown },
  api: BaseQueryApi,
  extraOptions: { signal?: AbortSignal }
) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery(
      { url: 'Auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      // Store the new token
      const { token } = refreshResult.data as RefreshTokenResponse
      sessionStorage.setToken(token)

      // Retry the original query
      result = await baseQuery(args, api, extraOptions)
    } else {
      // If refresh fails, clear the session
      sessionStorage.clear()
    }
  }

  return result
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: 'Auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'Auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          sessionStorage.setToken(data.token)
          sessionStorage.setUser(data.user)
          // Redirect to home page after successful login
          redirect('/')
        } catch {
          // Data will not be stored if login fails
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'Auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          sessionStorage.clear()
        } catch {
          // Still clear data even if the API call fails
          sessionStorage.clear()
        }
      },
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: 'Auth/refresh-token',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          sessionStorage.setToken(data.token)
        } catch {
          sessionStorage.clear()
        }
      },
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
} = authApi