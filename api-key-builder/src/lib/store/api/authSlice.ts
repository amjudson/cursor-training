import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
      const token = localStorage.getItem('token')
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
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
} = authApi 