'use client'

import { useLeaveSpaceMutation } from '@/entities/space'
import { useModalStore } from '@/shared/lib'
import { showErrorToast, showSuccessToast } from '@/shared/ui/toast/Toast'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { QUERY_KEYS } from '@/shared/config'

export const useLeaveSpace = () => {
  const closeModal = useModalStore(state => state.closeModal)
  const [confirmText, setConfirmText] = useState('')
  const queryClient = useQueryClient()
  const router = useRouter()

  // tanstack query
  const { isLeaving, mutateLeaveSpace } = useLeaveSpaceMutation({
    onSuccess: () => {
      // 성공 로직
      showSuccessToast('해당 스페이스를 탈퇴하셨습니다.')
      closeModal()
      router.push('/space')
    },
    onError: error => {
      // 실패 로직
      showErrorToast(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SPACE.all() })
    }
  })

  const isDeleteEnabled = confirmText.trim() === '탈퇴'

  return {
    isLeaving,
    confirmText,
    setConfirmText,
    handleLeave: mutateLeaveSpace,
    isDeleteEnabled
  }
}
