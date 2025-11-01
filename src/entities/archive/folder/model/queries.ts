'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchArchiveFolderClient,
  postArchiveFolderClient,
  deleteArchiveFolderClient,
  patchArchiveFolderClient
} from '../api/folder.client'
import { QUERY_KEYS, MUTATION_KEYS } from '@/shared/config'

// 폴더 조회
export const useGetArchiveFoldersQuery = () => {
  const foldersQuery = useQuery({
    queryKey: QUERY_KEYS.ARCHIVE_FOLDER.all(),
    queryFn: fetchArchiveFolderClient
  })
  return {
    foldersQuery
  }
}

// 폴더 생성
export const usePostArchiveFolderQuery = () => {
  const queryClient = useQueryClient()
  const addFolder = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FOLDER.create(),
    mutationFn: (folderName: string) => postArchiveFolderClient(folderName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ARCHIVE_FOLDER.all()
      })
    }
  })

  return {
    addFolder,
    isPending: addFolder.isPending
  }
}

// 폴더 삭제
export const useDeleteArchiveFolderQuery = () => {
  const queryClient = useQueryClient()
  const deleteFolder = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FOLDER.delete(),
    mutationFn: (folderId: number) => deleteArchiveFolderClient(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ARCHIVE_FOLDER.all()
      })
    }
  })

  return {
    deleteFolder
  }
}

//폴더 이름 수정
export const useEditArchiveFolderNameQuery = () => {
  const queryClient = useQueryClient()
  const updateFolderName = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FOLDER.update(),
    mutationFn: ({
      folderId,
      folderName
    }: {
      folderId: number
      folderName: string
    }) => patchArchiveFolderClient(folderId, folderName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ARCHIVE_FOLDER.all()
      })
    }
  })

  return {
    updateFolderName
  }
}
