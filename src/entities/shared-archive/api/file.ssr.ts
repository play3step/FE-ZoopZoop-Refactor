import { requireAuth } from '@/shared/lib/api-route'
import {
  SearchSpaceFileGetResponse,
  SpaceFileByPageRequest
} from '../model/type'

import { fetchSpaceFilesByPageServer } from './file.server'
import { CACHE_TAGS } from '@/shared/config'

// 페이지 내 파일 조회
export const getInitialSpaceFileList = async (
  params: SpaceFileByPageRequest = {}
): Promise<SearchSpaceFileGetResponse> => {
  const response = await requireAuth(async token => {
    return fetchSpaceFilesByPageServer(params, {
      token,
      //  next: { revalidate: 10, tags: ['spaceFiles'] }
      next: { tags: CACHE_TAGS.SPACE.file() }
    })
  })

  if (response.status !== 200) {
    throw new Error(response.msg)
  }

  /* TODO: 백엔드랑 데이터 구조 맞춰야함 */
  return response as SearchSpaceFileGetResponse
}
