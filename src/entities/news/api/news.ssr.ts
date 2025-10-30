import { requireAuth } from '@/shared/lib/api-route'

import { fetchRecommendedNewServer } from './news.server'
import { RecommendedNews } from '../model/type'

export const getInitialNews = async (payload: {
  folderId: string
}): Promise<RecommendedNews | null> => {
  const response = await requireAuth(async token => {
    return fetchRecommendedNewServer(payload.folderId, {
      token,
      next: { tags: [`news-${payload.folderId}`] }
    })
  })
  if (response.status !== 200) {
    throw new Error(response.msg)
  }
  return response.data
}
