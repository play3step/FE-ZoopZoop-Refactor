import { useMutation, useQueryClient } from '@tanstack/react-query'
import { softDeleteArchiveFileClient } from '../api/soft-delete.client'
import { MUTATION_KEYS } from '@/shared/config'

export const useMoveToTrashArchiveFilesQuery = () => {
  const queryClient = useQueryClient()
  const moveToTrash = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FILE.moveToTrash(),
    mutationFn: (dataSourceId: number[]) =>
      softDeleteArchiveFileClient(dataSourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archiveFilesPage'] })
    }
  })

  return {
    moveToTrash,
    isPending: moveToTrash.isPending
  }
}
