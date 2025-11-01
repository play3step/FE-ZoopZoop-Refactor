import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchRecommendedNewsClient } from '../api/news.client'
import { QUERY_KEYS } from '@/shared/config'

export const useRecommendedNews = (folderId: string) => {
  const { data, isPending, isFetching } = useQuery({
    queryKey: QUERY_KEYS.NEWS.recommended(folderId),
    queryFn: () => fetchRecommendedNewsClient(folderId),
    placeholderData: keepPreviousData
  })

  return {
    data,
    isPending,
    isFetching
  }
}
