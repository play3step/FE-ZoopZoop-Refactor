import {
  useMutation,
  UseMutationOptions,
  useQuery
} from '@tanstack/react-query'
import {
  fetchUserClient,
  fetchUserInfoByNameClient,
  updateNicknameClient,
  updateProfileImageClient
} from '../api/user.client'
import { Nickname, Profile, User } from './type'
import { QUERY_KEYS, MUTATION_KEYS } from '@/shared/config'

// 유저 프로필 이미지 업데이트
export const useUpdateProfileImageMutation = (
  options: Omit<UseMutationOptions<Profile, Error, File>, 'mutationFn'>
) => {
  const { mutate, isPending } = useMutation({
    mutationKey: MUTATION_KEYS.USER.updateProfile(),
    mutationFn: (file: File) => updateProfileImageClient(file),
    ...options
  })

  return {
    mutateUpdateProfileImage: mutate,
    isUploading: isPending
  }
}

// 유저 닉네임 업데이트
export const useUpdateNicknameMutation = (
  options: Omit<UseMutationOptions<Nickname, Error, string>, 'mutationFn'>
) => {
  const { mutate, isPending } = useMutation({
    mutationKey: MUTATION_KEYS.USER.updateNickname(),
    mutationFn: (nickname: string) => updateNicknameClient(nickname),
    ...options
  })

  return {
    mutateUpdateNickname: mutate,
    isUpdating: isPending
  }
}

// 유저 정보 조회 by nickname
export const useFetchUserInfoByNicknameQuery = (name: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER.byName(name),
    queryFn: () => fetchUserInfoByNameClient(name),
    enabled: !!name
  })
}

interface UserQuery {
  enabled?: boolean
}

// 유저 자신의 데이터 정보 패칭
export const useUserQuery = ({ enabled = true }: UserQuery) => {
  return useQuery<User>({
    queryKey: QUERY_KEYS.USER.me(),
    queryFn: fetchUserClient,
    refetchOnWindowFocus: false,
    enabled
  })
}
