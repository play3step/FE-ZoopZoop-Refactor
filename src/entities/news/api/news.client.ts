import { httpClient } from '@/shared/lib'
import { RecommendedNewsResponse } from '../model/type'

export const fetchRecommendedNewsClient = async (folderId: string) => {
  const response = await httpClient.get<RecommendedNewsResponse>(
    `/api/news/${folderId}`
  )
  if (response.status !== 200) {
    throw new Error(response.msg)
  }
  return response.data
}
