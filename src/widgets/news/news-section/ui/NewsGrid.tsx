'use client'

import { News } from '@/entities/news'
import { useNewsSave } from '@/features/news'

import { BaseNewsCard, MainNewsCard, SubNewsCard } from '@/shared/ui/card'

interface Props {
  news: News[]
  page: number
  type: 'main' | 'sub' | 'category'
  mainNews?: News
  subNews?: News[]
  spaceId?: string
}
export const NewsGrid = ({
  news,
  page,
  type,
  mainNews,
  subNews,
  spaceId
}: Props) => {
  const { handlePost, loadingMap } = useNewsSave(spaceId ?? '')
  const limitedNews = news.slice((page - 1) * 18, page * 18)

  return (
    <div>
      {type === 'main' && mainNews && subNews ? (
        <div className="flex gap-6">
          <MainNewsCard
            title={mainNews.title}
            content={mainNews.description}
            imageUrl={`/api/og-image?url=${encodeURIComponent(mainNews.link)}`}
            createdAt={mainNews.pubDate}
            link={mainNews.link}
            onSave={() => handlePost(mainNews.link)}
            loading={loadingMap[mainNews.link]}
          />

          <div className="flex flex-col gap-4">
            {subNews.map((item, index) => (
              <SubNewsCard
                key={item.link || `${item.title}-${index}`}
                title={item.title}
                content={item.description}
                imageUrl={`/api/og-image?url=${encodeURIComponent(item.link)}`}
                createdAt={item.pubDate}
                link={item.link}
                onSave={() => handlePost(item.link)}
                loading={loadingMap[item.link]}
                type="base"
              />
            ))}
          </div>
        </div>
      ) : type === 'category' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map((item, index) => (
            <SubNewsCard
              key={item.link || `${item.title}-${index}`}
              title={item.title}
              content={item.description}
              imageUrl={`/api/og-image?url=${encodeURIComponent(item.link)}`}
              createdAt={item.pubDate}
              link={item.link}
              onSave={() => handlePost(item.link)}
              loading={loadingMap[item.link]}
              type="base"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {limitedNews.map((item, index) => (
            <BaseNewsCard
              key={item.link || `${item.title}-${index}`}
              title={item.title}
              content={item.description}
              createdAt={item.pubDate}
              link={item.link}
              imageUrl={`/api/og-image?url=${encodeURIComponent(item.link)}`}
              type="base"
              onSave={() => handlePost(item.link)}
              loading={loadingMap[item.link]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
