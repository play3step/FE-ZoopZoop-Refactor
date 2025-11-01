import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { deleteAccountClient } from '@/entities/user/api/user.client'
import { MUTATION_KEYS } from '@/shared/config'

export const useDeleteAccountMutation = (options: UseMutationOptions) => {
  const { mutate, isPending } = useMutation({
    mutationKey: MUTATION_KEYS.AUTH.delete(),
    mutationFn: deleteAccountClient,
    ...options
  })

  return {
    mutateDeleteAccount: mutate,
    isDeleting: isPending
  }
}
