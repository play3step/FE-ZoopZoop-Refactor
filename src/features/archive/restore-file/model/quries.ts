import { useMutation, useQueryClient } from '@tanstack/react-query'
import { restoreManyArchiveFileClient } from '../api/restoreFile.client'
import { MUTATION_KEYS } from '@/shared/config'

export const useRestoreArchiveFilesQuery = () => {
  const queryClient = useQueryClient()
  const restoreFile = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FILE.restore(),
    mutationFn: (dataSourceId: number[]) =>
      restoreManyArchiveFileClient(dataSourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archiveFilesPage'] })
    }
  })

  return {
    restoreFile
  }
}
