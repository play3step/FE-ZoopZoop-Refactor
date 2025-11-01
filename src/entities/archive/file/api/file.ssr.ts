import { requireAuth } from '@/shared/lib/api-route'
import { fetchArchiveFilesByPageServer } from './file.server'
import { SearchGetResponse, FileSearchParams } from '../model/type'
import { CACHE_TAGS } from '@/shared/config'

// 페이지 내 파일 조회
export const getInitialFileList = async (
  params: FileSearchParams = {}
): Promise<SearchGetResponse> => {
  const response = await requireAuth(async token => {
    return fetchArchiveFilesByPageServer(params, {
      token,
      cache: 'no-store',
      next: { tags: CACHE_TAGS.ARCHIVE.file() }
    })
  })

  if (response.status !== 200) {
    throw new Error(response.msg)
  }

  /* TODO: 백엔드랑 데이터 구조 맞춰야함 */
  return response as SearchGetResponse
}
