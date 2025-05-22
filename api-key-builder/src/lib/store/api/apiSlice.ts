import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface ApiKey {
  id: number;
  name: string;
  key: string;
  usages: number;
  createdAt: Date;
  lastUsed: Date | null;
  isActive: boolean;
}

export interface ValidateApiKeyResponse {
  isValid: boolean;
  message: string;
  apiKey: ApiKey | null;
}

const controllerName = 'ApiKeys'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5293/api',
    prepareHeaders: (headers) => {
      // Add any auth headers here if needed
      return headers
    },
  }),
  tagTypes: ['ApiKey'],
  endpoints: (builder) => ({
    getApiKeys: builder.query<ApiKey[], void>({
      query: () => `${controllerName}/GetApiKeys`,
      providesTags: ['ApiKey'],
    }),
    getApiKey: builder.query<ApiKey, number>({
      query: (id) => `${controllerName}/GetApiKey/${id}`,
      providesTags: (result, error, id) => [{ type: 'ApiKey', id }],
    }),
    createApiKey: builder.mutation<ApiKey, Partial<ApiKey>>({
      query: (body) => ({
        url: `${controllerName}/CreateApiKey`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ApiKey'],
    }),
    updateApiKey: builder.mutation<void, ApiKey>({
      query: (apiKey) => ({
        url: `${controllerName}/UpdateApiKey/${apiKey.id}`,
        method: 'PUT',
        body: apiKey,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ApiKey', id }],
    }),
    deleteApiKey: builder.mutation<void, number>({
      query: (id) => ({
        url: `${controllerName}/DeleteApiKey/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ApiKey'],
    }),
    validateApiKey: builder.mutation<ValidateApiKeyResponse, { key: string }>({
      query: (body) => ({
        url: `${controllerName}/ValidateApiKey`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetApiKeysQuery,
  useGetApiKeyQuery,
  useCreateApiKeyMutation,
  useUpdateApiKeyMutation,
  useDeleteApiKeyMutation,
  useValidateApiKeyMutation,
} = apiSlice 