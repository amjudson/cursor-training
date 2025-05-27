'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useToast } from '@/components/toast-provider'
import { useCreateApiKeyMutation } from '@/lib/store/api/apiSlice'
import crypto from 'crypto'

const createKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  userId: z.string(),
  key: z.string().default(''),
  usages: z.number().default(0),
  createdAt: z.date().default(new Date()),
  lastUsed: z.date().default(new Date()),
  isActive: z.boolean().default(true),
})

type CreateKeyForm = z.infer<typeof createKeySchema>;

interface CreateKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateKeyModal({ open, onOpenChange, onSuccess }: CreateKeyModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CreateKeyForm>({
    resolver: zodResolver(createKeySchema),
  })
  const toast = useToast()
  const [createApiKey] = useCreateApiKeyMutation()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-')
    setValue('name', value)
  }

  async function onSubmit(data: CreateKeyForm) {
    console.log('Submitting API key creation with data:', data)
    setIsLoading(true)
    data.key = `ak_${crypto.randomBytes(32).toString('hex')}`
    data.createdAt = new Date()
    data.lastUsed = new Date()
    data.usages = 0
    data.isActive = true
    data.userId = '' // Replace with actual user ID logic
    try {
      await createApiKey(data).unwrap()
      reset()
      onSuccess()
      onOpenChange(false)
      toast.show({ title: 'API Key created', variant: 'success' })
    } catch {
      toast.show({ title: 'Failed to create API key', variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#23272F] p-8 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4 text-white">Create New API Key</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-200">
                Key Name
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                data-testid="create-key-name-input"
                className="w-full px-3 py-2 border rounded-md bg-[#181C23] border-[#23272F] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a name for your API key"
                disabled={isLoading}
                onChange={handleNameChange}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Creating...' : 'Create Key'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 