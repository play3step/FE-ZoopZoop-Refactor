import { Invitation, useAcceptInvitationMutation } from '@/entities/invitation'
import { showErrorToast, showSuccessToast } from '@/shared/ui/toast/Toast'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/config'

interface MutationContext {
  prevInvitations: Invitation[]
}

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient()
  // tanstack query
  const { acceptInvitationMutate, isAccepting, variables } =
    useAcceptInvitationMutation({
      onMutate: async ({ inviteId }) => {
        await queryClient.cancelQueries({
          queryKey: QUERY_KEYS.INVITATION.list()
        })

        const prevInvitations = queryClient.getQueryData<Invitation[]>(
          QUERY_KEYS.INVITATION.list()
        )
        if (prevInvitations) {
          const newInvitations = prevInvitations.filter(
            invitation => invitation.inviteId !== inviteId
          )

          queryClient.setQueryData(QUERY_KEYS.INVITATION.list(), newInvitations)
        }
        return { prevInvitations }
      },
      onSuccess: () => {
        showSuccessToast('스페이스 초대를 수락했습니다')
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SPACE.all() })
      },
      onError: (error, _, onMutateResult) => {
        showErrorToast(error.message)
        const context = onMutateResult as MutationContext
        if (context.prevInvitations) {
          queryClient.setQueryData(
            QUERY_KEYS.INVITATION.list(),
            context.prevInvitations
          )
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.INVITATION.list()
        })
      }
    })

  return {
    handleAccept: acceptInvitationMutate,
    isAccepting,
    acceptingInviteId: variables?.inviteId
  }
}
