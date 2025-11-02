import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EditFileWithImgRequest,
  EditFileWithoutImgRequest,
  FileSearchParams,
  SearchGetResponse
} from './type'
import {
  deleteManyArchiveFileClient,
  deleteOneArchiveFileClient,
  editArchiveFileWithImgClient,
  editArchiveFileWithoutImgClient,
  fetchArchiveFilesByFolderClient,
  fetchArchiveFilesByPageClient,
  postArchiveFileClient
} from '../api/file.client'
import { QUERY_KEYS, MUTATION_KEYS } from '@/shared/config'
import { revalidateArchiveFiles } from './archive'

export const useArchiveFilesByFolderQuery = (
  folderId: number,
  options?: { enabled?: boolean }
) => {
  const filesQuery = useQuery({
    queryKey: QUERY_KEYS.ARCHIVE_FILE.byFolder(folderId),
    queryFn: () => fetchArchiveFilesByFolderClient(folderId),
    enabled: options?.enabled
  })

  return { filesQuery }
}

// initial data 받아서 모든 쿼리 다 받아야됨
interface PageQuery {
  query: FileSearchParams
  initialData?: SearchGetResponse
}

export const useArchiveFilesByPageQuery = ({
  query,
  initialData
}: PageQuery) => {
  const { folderId, page, sort, size, keyword, isActive } = query

  return useQuery({
    queryKey: QUERY_KEYS.ARCHIVE_FILE.byPage(
      folderId ?? 0,
      page ?? 1,
      sort ?? '',
      keyword,
      isActive
    ),
    queryFn: () =>
      fetchArchiveFilesByPageClient({
        folderId,
        page,
        size,
        keyword,
        sort,
        isActive
      }),
    initialData: initialData
  })
}

export const useDeleteOneArchiveFileQuery = () => {
  const queryClient = useQueryClient()
  const deleteOneFile = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FILE.deleteOne(),
    mutationFn: (dataSourceId: number) =>
      deleteOneArchiveFileClient(dataSourceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ARCHIVE_FILE.all()
      })
      await revalidateArchiveFiles()
    }
  })
  return { deleteOneFile }
}

export const useDeleteManyArchiveFileQuery = () => {
  const queryClient = useQueryClient()
  const deleteManyFile = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FILE.deleteMany(),
    mutationFn: (dataSourceId: number[]) =>
      deleteManyArchiveFileClient(dataSourceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ARCHIVE_FILE.all()
      })
      await revalidateArchiveFiles()
    }
  })
  return { deleteManyFile }
}

//파일 수정
export const useEditArchiveFileQuery = () => {
  const queryClient = useQueryClient()
  const editFileWithoutImg = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FILE.editWithoutImg(),
    mutationFn: (fileData: EditFileWithoutImgRequest) =>
      editArchiveFileWithoutImgClient(fileData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ARCHIVE_FILE.all()
      })
      await revalidateArchiveFiles()
    }
  })
  const editFileWithImg = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FILE.editWithImg(),
    mutationFn: (fileData: EditFileWithImgRequest) =>
      editArchiveFileWithImgClient(fileData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ARCHIVE_FILE.all()
      })
      await revalidateArchiveFiles()
    }
  })

  return { editFileWithoutImg, editFileWithImg }
}

// 파일 업로드
export const useUploadArchiveFileQuery = () => {
  const queryClient = useQueryClient()
  const uploadFile = useMutation({
    mutationKey: MUTATION_KEYS.ARCHIVE_FILE.upload(),
    mutationFn: ({
      folderId,
      sourceUrl
    }: {
      folderId: number
      sourceUrl: string
    }) => postArchiveFileClient(folderId, sourceUrl),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ARCHIVE_FILE.all()
      })
      await revalidateArchiveFiles()
    }
  })
  return { uploadFile }
}
