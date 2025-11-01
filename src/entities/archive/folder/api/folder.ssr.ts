import { requireAuth } from '@/shared/lib/api-route'
import { FolderData } from '../model/type'
import { fetchArchiveFolderServer } from './folder.server'
import { CACHE_TAGS } from '@/shared/config'

// 페이지 내 폴더 조회
export const getInitialFolderList = async (): Promise<FolderData[]> => {
  const response = await requireAuth(async token => {
    return fetchArchiveFolderServer({
      token,
      next: { tags: CACHE_TAGS.ARCHIVE.folder() },
      cache: 'no-store'
    })
  })

  if (response.status !== 200) {
    throw new Error(response.msg)
  }

  return response.data ?? []
}
