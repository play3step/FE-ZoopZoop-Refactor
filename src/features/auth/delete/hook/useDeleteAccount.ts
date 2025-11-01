import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useUserStore } from '@/entities/user'
import { useModalStore } from '@/shared/lib'
import { useQueryClient } from '@tanstack/react-query'
import { PATH } from '@/shared/constants'
import { useDeleteAccountMutation } from './useDeleteAccountMutation'
import { QUERY_KEYS } from '@/shared/config'

export const useDeleteAccount = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const closeModal = useModalStore(state => state.closeModal)
  const clearUser = useUserStore(state => state.clearUser)
  const [confirmText, setConfirmText] = useState('')

  const isDeleteEnabled = confirmText === '계정 영구 삭제'

  const { isDeleting, mutateDeleteAccount } = useDeleteAccountMutation({
    onSuccess: () => {
      clearUser()
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.me() })
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER.me() })
      router.push(PATH.AUTH.LOGIN)
    },
    onError: () => {},
    onSettled: () => {
      closeModal()
    }
  })

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault()
    mutateDeleteAccount()
  }

  return {
    handleDelete,
    onClose: closeModal,
    isDeleting,
    setConfirmText,
    confirmText,
    isDeleteEnabled
  }
}
