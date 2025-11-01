import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  moveManyArchiveFilesClient,
  moveOneArchiveFilesClient
} from '../api/moveFile.client'
import { ManyFileMove, OneFileMove } from './type'
import { MUTATION_KEYS } from '@/shared/config'

// 파일 다건 이동
export const useMoveManyArchiveFilesQuery = () => {
  const queryClient = useQueryClient()
  const moveFiles = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FILE.moveMany(),
    mutationFn: ({ dataSourceId, folderId }: ManyFileMove) =>
      moveManyArchiveFilesClient({ dataSourceId, folderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archiveFilesPage'] })
    }
  })

  return {
    moveFiles
  }
}

export const useMoveOneArchiveFilesQuery = () => {
  const queryClient = useQueryClient()
  const moveFile = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FILE.moveOne(),
    mutationFn: ({ dataSourceId, folderId }: OneFileMove) =>
      moveOneArchiveFilesClient({ dataSourceId, folderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archiveFilesPage'] })
    }
  })

  return {
    moveFile
  }
}
