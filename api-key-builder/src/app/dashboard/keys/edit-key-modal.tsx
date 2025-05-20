"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/components/toast-provider";

const editKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});
type EditKeyForm = z.infer<typeof editKeySchema>;

interface EditKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  keyId: string;
  initialName: string;
}

export function EditKeyModal({ open, onOpenChange, onSuccess, keyId, initialName }: EditKeyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<EditKeyForm>({
    resolver: zodResolver(editKeySchema),
    defaultValues: { name: initialName },
  });
  const toast = useToast();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-');
    setValue('name', value);
  };

  async function onSubmit(data: EditKeyForm) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/keys/${keyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to update API key");
      }
      reset();
      onSuccess();
      onOpenChange(false);
      toast.show({ title: "API Key updated", variant: "success" });
    } catch {
      toast.show({ title: "Failed to update API key", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#23272F] p-8 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4 text-white">Edit API Key</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-200">
                Key Name
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                data-testid="edit-key-name-input"
                className="w-full px-3 py-2 border rounded-md bg-[#181C23] border-[#23272F] text-white"
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
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 