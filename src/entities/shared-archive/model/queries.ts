import {
  TrashSpaceFileRequest,
  SearchSpaceFileGetResponse,
  SpaceFileByPageRequest,
  EditSpaceFileWithoutImgRequest,
  EditSpaceFileWithImgRequest
} from './type'
import {
  deleteManySpaceFileClient,
  editSpaceFileWithImgClient,
  editSpaceFileWithoutImgClient,
  fetchSpaceFilesByFolderClient,
  fetchSpaceFilesClient
} from '../api/file.client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS, MUTATION_KEYS } from '@/shared/config'

interface PageQuery {
  query: SpaceFileByPageRequest
  initialData?: SearchSpaceFileGetResponse
}
//페이지 내 파일 조회
export const useSpaceFilesQuery = ({ query, initialData }: PageQuery) => {
  const { spaceId, page, sort, keyword, isActive } = query

  return useQuery({
    queryKey: QUERY_KEYS.SHARED_ARCHIVE.byPage(
      spaceId ?? 0,
      page ?? 1,
      sort ?? '',
      keyword,
      isActive
    ),
    queryFn: () =>
      fetchSpaceFilesClient({
        spaceId,
        page,
        keyword,
        sort,
        isActive
      }),
    initialData: initialData
  })
}

//폴더 내 파일 조회
export const useSpaceFilesByFolderQuery = (
  spaceId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: QUERY_KEYS.SHARED_ARCHIVE.byFolder(spaceId),
    queryFn: () => fetchSpaceFilesByFolderClient({ spaceId }),
    enabled: options?.enabled
  })
}

export const useDeleteManySpaceFileQuery = () => {
  const queryClient = useQueryClient()
  const deleteManyFile = useMutation({
    mutationKey: MUTATION_KEYS.SHARED_ARCHIVE.deleteMany(),
    mutationFn: ({ spaceId, dataSourceId }: TrashSpaceFileRequest) =>
      deleteManySpaceFileClient({ spaceId, dataSourceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SHARED_ARCHIVE.all()
      })
    }
  })
  return { deleteManyFile }
}

// 파일 수정
export const useEditSpaceFileQuery = () => {
  const queryClient = useQueryClient()
  const editFileWithoutImg = useMutation({
    mutationKey: MUTATION_KEYS.SHARED_ARCHIVE.editWithoutImg(),
    mutationFn: (fileData: EditSpaceFileWithoutImgRequest) =>
      editSpaceFileWithoutImgClient(fileData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SHARED_ARCHIVE.all()
      })
    }
  })
  const editFileWithImg = useMutation({
    mutationKey: MUTATION_KEYS.SHARED_ARCHIVE.editWithImg(),
    mutationFn: (fileData: EditSpaceFileWithImgRequest) =>
      editSpaceFileWithImgClient(fileData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SHARED_ARCHIVE.all()
      })
    }
  })

  return { editFileWithoutImg, editFileWithImg }
}
