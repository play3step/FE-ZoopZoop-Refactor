import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { useUserStore } from '@/entities/user'
import { PATH } from '@/shared/constants'
import { useLogoutMutation } from './useLogoutMutation'
import { QUERY_KEYS } from '@/shared/config'

export const useLogout = () => {
  const router = useRouter()
  const clearUser = useUserStore(state => state.clearUser)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useLogoutMutation({
    onSuccess: () => {
      clearUser()
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.me() })
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER.me() })
      router.push(PATH.ROOT)
    },
    onError: () => {
      // 에러 코드
    }
  })

  return {
    logout: () => mutate(),
    isLoading: isPending
  }
}
