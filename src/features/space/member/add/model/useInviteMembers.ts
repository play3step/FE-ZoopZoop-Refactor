import { useAddMembersMutation } from '@/entities/space'
import { useUserStore } from '@/entities/user'
import { QUERY_KEYS } from '@/shared/config'
import { useModalStore } from '@/shared/lib'
import { showErrorToast, showSuccessToast } from '@/shared/ui/toast/Toast'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export const useInviteMembers = () => {
  const userInfo = useUserStore(state => state.user)
  const closeModal = useModalStore(state => state.closeModal)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const queryClient = useQueryClient()

  // tanstack query
  const { mutateAddMembers, isAdding } = useAddMembersMutation({
    onSuccess: () => {
      showSuccessToast('초대 전송 완료')
      clearMembers()
      closeModal()
    },
    onError: () => {
      showErrorToast('초대 전송을 실패했습니다.')
    },
    onSettled: (_data, _error, { spaceId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPACE_MEMBER.pending(spaceId)
      })
    }
  })

  const addMember = (name: string) => {
    if (userInfo?.name === name)
      return showErrorToast('자신을 추가할 수 없습니다.')
    const isAlreadyAdded = selectedMembers.some(m => m === name)

    // 이미 추가된 맴버
    if (isAlreadyAdded) {
      return showErrorToast('이미 추가된 맴버입니다.')
    }
    setSelectedMembers(prev => [...prev, name])
    return
  }

  // 전체 초기화
  const clearMembers = () => {
    setSelectedMembers([])
  }
  // 멤버 제거
  const removeMember = (name: string) => {
    setSelectedMembers(prev => prev.filter(m => m !== name))
  }

  // 초대
  const inviteMembers = async (spaceId: number) => {
    if (selectedMembers.length === 0) {
      return showErrorToast('초대할 멤버를 선택해주세요')
    }
    mutateAddMembers({ memberNames: selectedMembers, spaceId })
  }

  return {
    selectedMembers,
    isAdding,
    addMember,
    removeMember,
    clearMembers,
    inviteMembers,
    hasSelectedMembers: selectedMembers.length > 0
  }
}
