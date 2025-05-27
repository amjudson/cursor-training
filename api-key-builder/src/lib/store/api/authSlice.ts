import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'

interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

interface RegisterResponse {
  message: string
}

interface LoginRequest {
  email: string
  password: string
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface LoginResponse {
  token: string
  user: User
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5293/api',
    prepareHeaders: (headers) => {
      const token = Cookies.get('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
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
          // Store token in cookie with 7 day expiry
          Cookies.set('token', data.token, { expires: 7 })
        } catch {
          // Token will not be stored if login fails
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
          Cookies.remove('token')
        } catch {
          // Still remove token even if the API call fails
          Cookies.remove('token')
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