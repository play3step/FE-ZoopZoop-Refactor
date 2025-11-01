import { useMutation, useQueryClient } from '@tanstack/react-query'
import { restoreSpaceFileClient } from '../api/restoreFile.client'
import { TrashSpaceFileRequest } from '@/entities/shared-archive/model/type'
import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/config'

export const useRestoreArchiveFilesQuery = () => {
  const queryClient = useQueryClient()
  const restoreFile = useMutation({
    mutationKey: MUTATION_KEYS.SHARED_ARCHIVE.restore(),
    mutationFn: ({ spaceId, dataSourceId }: TrashSpaceFileRequest) =>
      restoreSpaceFileClient({ spaceId, dataSourceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SHARED_ARCHIVE.files()
      })
    }
  })

  return {
    restoreFile
  }
}
