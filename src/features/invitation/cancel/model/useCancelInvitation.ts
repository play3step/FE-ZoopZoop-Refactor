import { Invitation, useCancelInvitationMutation } from '@/entities/invitation'
import { showErrorToast, showSuccessToast } from '@/shared/ui/toast/Toast'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/config'

interface MutationContext {
  prevInvitations: Invitation[]
}

export const useCancelInvitation = () => {
  const queryClient = useQueryClient()

  const { cancelInvitationMutate, isCanceling, variables } =
    useCancelInvitationMutation({
      onMutate: async ({ inviteId }) => {
        await queryClient.cancelQueries({
          queryKey: QUERY_KEYS.INVITATION.list()
        })

        const preInvitations = queryClient.getQueryData<Invitation[]>(
          QUERY_KEYS.INVITATION.list()
        )

        if (preInvitations) {
          const newInvitations = preInvitations.filter(
            invitation => invitation.inviteId !== inviteId
          )
          queryClient.setQueryData(QUERY_KEYS.INVITATION.list(), newInvitations)
        }

        return { preInvitations }
      },
      onSuccess: data => {
        showSuccessToast(`'${data?.name}' 초대를 거절했습니다.`)
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
    handleCancel: cancelInvitationMutate,
    isCanceling,
    cancelingInviteId: variables?.inviteId
  }
}
