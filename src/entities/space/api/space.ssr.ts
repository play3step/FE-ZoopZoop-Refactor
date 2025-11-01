import { requireAuth } from '@/shared/lib/api-route'
import { fetchSpaceListServer, fetchSpaceServer } from './space.server'
import { FetchSpaceListParams, Space, SpacePagination } from '../model/type'
import { CACHE_TAGS } from '@/shared/config'

// 서버 컴포넌트  API 호출 함수

/**
 *  space list initial data
 */
export const getInitialSpaceList = async (
  params: FetchSpaceListParams = {}
): Promise<SpacePagination | null> => {
  const response = await requireAuth(async token => {
    return fetchSpaceListServer(params, {
      token,
      next: { tags: CACHE_TAGS.SPACE.list() }
    })
  })

  if (response.status !== 200) {
    throw new Error(response.msg)
  }

  return response.data
}

// space info ssr
export const getSpaceInfo = async (spaceId: number): Promise<Space | null> => {
  const response = await requireAuth(
    async token =>
      await fetchSpaceServer(spaceId, {
        token,
        next: { revalidate: 60, tags: ['spaceInfo'] }
      })
  )

  if (response.status !== 200) {
    throw new Error(response.msg)
  }

  return response.data
}
