import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postCopyFileToSpaceClient } from '../api/copyToSpace.client'
import { fetchSpaceListClient } from '@/entities/space'
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/config'

//스페이스로 복사
export const useCopyToSpaceArchiveFilesQuery = () => {
  const queryClient = useQueryClient()
  const copyToSpace = useMutation({
    mutationKey: MUTATION_KEYS.SHARED_ARCHIVE.copyToSpace(),
    mutationFn: (payload: {
      spaceId: number | null
      dataSourceId: number[]
      targetFolderId: number
    }) => postCopyFileToSpaceClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SHARED_ARCHIVE.files()
      })
    }
  })

  return {
    copyToSpace
  }
}

// 스페이스 전체 목록
export const useFetchAllSpacesQuery = () => {
  const { data, isPending, isFetching } = useQuery({
    queryKey: QUERY_KEYS.SPACE.allList(),
    queryFn: () =>
      fetchSpaceListClient({
        page: 0,
        size: 1000
      })
  })

  return {
    spaces: data,
    isPending,
    isFetching
  }
}
