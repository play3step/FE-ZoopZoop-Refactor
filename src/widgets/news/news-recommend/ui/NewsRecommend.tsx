'use client'

import { useRecommendedNews } from '@/entities/news/model/useRecommendedNews'
import Pagination from '@/shared/ui/pagination/Pagination'
import { NewsGrid } from '@/widgets/news/news-section'
import { useSearchParams } from 'next/navigation'

export const RecommendedNewsList = ({
  selectedFolderId
}: {
  selectedFolderId: string
}) => {
  const searchParams = useSearchParams()
  const folderId = searchParams.get('folderId') || selectedFolderId
  const page = Number(searchParams.get('page')) || 1

  const { data, isPending } = useRecommendedNews(folderId)

  if (isPending) {
    return <div className="text-center py-20">로딩중...</div>
  }

  if (!data?.items || data.items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        추천할 뉴스가 없습니다.
      </div>
    )
  }

  return (
    <div>
      <NewsGrid
        news={data.items}
        page={page}
        type="sub"
      />

      <div className="mt-8">
        <Pagination totalPages={data.total ? Math.ceil(data.total / 18) : 1} />
      </div>
    </div>
  )
}
