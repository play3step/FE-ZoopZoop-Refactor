import { useDeleteSpaceMutation } from '@/entities/space'
import { useModalStore } from '@/shared/lib'
import { showErrorToast, showSuccessToast } from '@/shared/ui/toast/Toast'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { QUERY_KEYS } from '@/shared/config'

export const useDeleteSpace = (spaceId: number) => {
  const [confirmText, setConfirmText] = useState<string>('')
  const closeModal = useModalStore(state => state.closeModal)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutateDeleteSpace, isDeleting } = useDeleteSpaceMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SPACE.all() })
      closeModal()
      router.push('/space?page=1')
      showSuccessToast('스페이스 삭제 완료')
    },
    onError: error => {
      showErrorToast(error.message)
    }
  })

  // 파생 상태
  const isDeleteEnabled = (title: string) => {
    return confirmText.trim() === title.trim()
  }

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault()
    mutateDeleteSpace(spaceId)
  }

  return {
    isDeleting,
    confirmText,
    handleDelete,
    setConfirmText,
    isDeleteEnabled
  }
}
