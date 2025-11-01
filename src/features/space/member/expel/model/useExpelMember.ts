import { useExpelMemberMutation } from '@/entities/space/member/model/queries'
import { QUERY_KEYS } from '@/shared/config'
import { useModalStore } from '@/shared/lib'
import { showErrorToast, showSuccessToast } from '@/shared/ui/toast/Toast'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export const useExpelMember = () => {
  const closeModal = useModalStore(state => state.closeModal)
  const [confirmText, setConfirmText] = useState('')
  const queryClient = useQueryClient()

  const { mutateExpelMember, isExpelling } = useExpelMemberMutation({
    onSuccess: data => {
      if (!data) return
      showSuccessToast(`${data.expelledMemberInfo.name}님을 퇴출했습니다`)
      closeModal()
    },
    onError: error => {
      showErrorToast(error.message)
    },
    onSettled: (_data, _error, { spaceId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPACE_MEMBER.list(spaceId)
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPACE_MEMBER.pending(spaceId)
      })
    }
  })

  const isDeleteEnabled = (name: string) => {
    return confirmText.trim() === name.trim()
  }

  return {
    handleExpel: mutateExpelMember,
    isExpelling,
    confirmText,
    isDeleteEnabled,
    setConfirmText
  }
}
