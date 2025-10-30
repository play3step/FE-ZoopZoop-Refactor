import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchRecommendedNewsClient } from '../api/news.client'

export const useRecommendedNews = (folderId: string) => {
  const { data, isPending, isFetching } = useQuery({
    queryKey: ['recommended-news', folderId],
    queryFn: () => fetchRecommendedNewsClient(folderId),
    placeholderData: keepPreviousData
  })

  return {
    data,
    isPending,
    isFetching
  }
}
