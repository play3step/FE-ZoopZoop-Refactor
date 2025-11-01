import { useCreateSpaceMutation } from '@/entities/space'
import { useModalStore } from '@/shared/lib'
import { showErrorToast, showSuccessToast } from '@/shared/ui/toast/Toast'
import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { CACHE_TAGS, QUERY_KEYS } from '@/shared/config'
import { revalidateTag } from 'next/cache'

export const useCreateSpace = () => {
  const queryClient = useQueryClient()

  const inputRef = useRef<HTMLInputElement>(null)
  const closeModal = useModalStore(state => state.closeModal)

  // tanstack query
  const { mutateCreateSpace, isCreating } = useCreateSpaceMutation({
    onSuccess: data => {
      // space 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SPACE.all() })
      revalidateTag(CACHE_TAGS.SPACE.list()[0])
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
