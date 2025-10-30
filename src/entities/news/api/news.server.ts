import { httpClient } from '@/shared/lib'
import { NewsResponse, RecommendedNewsResponse } from '../model/type'
import { NextFetchOptions } from '@/shared/types'

export const fetchNews = async (): Promise<NewsResponse> => {
  return httpClient.get<NewsResponse>('/api/v1/news', {
    next: { revalidate: 30 }
  })
}

export const fetchNewsByKeywords = async (
  keywords: string,
  options?: NextFetchOptions
): Promise<NewsResponse> => {
  return httpClient.post<NewsResponse>(
    `/api/v1/news/keywords`,
    { keywords: [keywords] },
    { next: { revalidate: 300, tags: [`news-${keywords}`] }, ...options }
  )
}

// 개인 기준 뉴스 추천
export const fetchRecommendedNewServer = async (
  payload: string,
  options?: NextFetchOptions
): Promise<RecommendedNewsResponse> => {
  return httpClient.get<RecommendedNewsResponse>(
    `/api/v1/news/recommends/personal/${payload}`,
    options
  )
}

export const fetchSpaceRecommendedNews = async (
  payload: { spaceId: string; folderId: string },
  options?: NextFetchOptions
): Promise<RecommendedNewsResponse> => {
  return httpClient.get<RecommendedNewsResponse>(
    `/api/v1/news/recommends/shared/${payload.spaceId}/${payload.folderId}`,
    options
  )
}
