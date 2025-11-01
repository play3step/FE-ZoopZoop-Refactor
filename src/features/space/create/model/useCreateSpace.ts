import { useCreateSpaceMutation } from '@/entities/space'
import { useModalStore } from '@/shared/lib'
import { showErrorToast, showSuccessToast } from '@/shared/ui/toast/Toast'
import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { QUERY_KEYS } from '@/shared/config'
import { revalidateSpaceList } from './space'

export const useCreateSpace = () => {
  const queryClient = useQueryClient()

  const inputRef = useRef<HTMLInputElement>(null)
  const closeModal = useModalStore(state => state.closeModal)

  // tanstack query
  const { mutateCreateSpace, isCreating } = useCreateSpaceMutation({
    onSuccess: async data => {
      // space 목록 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SPACE.all() })
      await revalidateSpaceList()

      showSuccessToast(`'${data?.name}' 스페이스 생성 완료`)
      closeModal()
    },
    onError: error => {
      showErrorToast(error.message)
    }
  })

  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputRef?.current) return

    const spaceName = inputRef.current.value.trim()
    if (!spaceName) return

    mutateCreateSpace(spaceName)
  }

  return {
    inputRef,
    handleCreateSpace,
    isCreating
  }
}
