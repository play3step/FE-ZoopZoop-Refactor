import { useMutation, useQueryClient } from '@tanstack/react-query'
import { softDeleteSpaceFileClient } from '../api/soft-delete.client'
import { SpaceSoftDeleteRequest } from './type'
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/config'
import { revalidateSpaceFiles } from '@/entities/shared-archive'

export const useMoveToTrashSpaceFilesQuery = () => {
  const queryClient = useQueryClient()
  const moveToTrash = useMutation({
    mutationKey: MUTATION_KEYS.SHARED_ARCHIVE.moveToTrash(),
    mutationFn: ({ spaceId, dataSourceId }: SpaceSoftDeleteRequest) =>
      softDeleteSpaceFileClient({ spaceId, dataSourceId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SHARED_ARCHIVE.files()
      })
      await revalidateSpaceFiles()
    }
  })

  return {
    moveToTrash
  }
}
