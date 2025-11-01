import { useMutation, useQueryClient } from '@tanstack/react-query'
import { softDeleteSpaceFileClient } from '../api/soft-delete.client'
import { SpaceSoftDeleteRequest } from './type'
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/config'

export const useMoveToTrashSpaceFilesQuery = () => {
  const queryClient = useQueryClient()
  const moveToTrash = useMutation({
    mutationKey: MUTATION_KEYS.SHARED_ARCHIVE.moveToTrash(),
    mutationFn: ({ spaceId, dataSourceId }: SpaceSoftDeleteRequest) =>
      softDeleteSpaceFileClient({ spaceId, dataSourceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SHARED_ARCHIVE.files()
      })
    }
  })

  return {
    moveToTrash
  }
}
