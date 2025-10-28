import { getInitialFolderList } from '@/entities/archive/folder/api/folder.ssr'
import { getInitialNews } from '@/entities/news'
import { RecommendedNewsList } from '@/widgets/news/news-recommend/ui/NewsRecommend'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '추천 뉴스',
  description: '추천 뉴스'
}

export default async function Recommend({
  searchParams
}: {
  searchParams: Promise<{ page: string; folderId?: string }>
}) {
  const folders = await getInitialFolderList()
  const { page, folderId } = await searchParams

  const queryClient = new QueryClient()

  if (!folders || folders.length === 0) {
    return (
      <div className="w-full flex flex-col p-10 min-h-[calc(100vh-72px)] bg-white">
        <div className="flex-1 flex flex-col">
          <div className="pb-4">
            <h1 className="text-2xl font-bold text-gray-900">AI 추천 뉴스</h1>
            <div className="w-12 h-1 bg-gray-800 mt-2 mb-1"></div>
            <p className="text-sm text-gray-600 mt-2">
              저장한 폴더를 분석하여 관심사에 맞는 뉴스를 추천합니다
            </p>
          </div>
          <div className="text-center py-20 text-gray-500">
            폴더를 먼저 생성해주세요.
          </div>
        </div>
      </div>
    )
  }

  let defaultFolder
  const remainFolders = []

  for (const folder of folders) {
    if (folder.folderName === 'default') {
      defaultFolder = folder
    } else {
      remainFolders.push(folder)
    }
  }

  const list = defaultFolder ? [defaultFolder, ...remainFolders] : remainFolders

  const selectedFolderId = folderId || defaultFolder?.folderId?.toString() || ''

  await queryClient.prefetchQuery({
    queryKey: ['recommended-news', selectedFolderId],
    queryFn: () => getInitialNews({ folderId: selectedFolderId })
  })

  // const currentPage = Number(page) || 1

  return (
    <div className="w-full flex flex-col p-10 min-h-[calc(100vh-72px)] bg-white">
      <div className="flex-1 flex flex-col">
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-gray-900">AI 추천 뉴스</h1>
          <div className="w-12 h-1 bg-gray-800 mt-2 mb-1"></div>
          <p className="text-sm text-gray-600 mt-2">
            저장한 폴더를 분석하여 관심사에 맞는 뉴스를 추천합니다
          </p>
        </div>

        <div className="py-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">
            분석된 관심 폴더
          </h2>
          <div className="flex gap-2">
            {list.map(folder => (
              <a
                key={folder.folderId}
                href={`/news/recommend?folderId=${folder.folderId}`}
                className={`px-4 py-2 rounded-md ${
                  selectedFolderId === folder.folderId.toString()
                    ? 'bg-green-normal text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                {folder.folderName === 'default'
                  ? '기본 폴더'
                  : folder.folderName}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <RecommendedNewsList selectedFolderId={selectedFolderId} />
          </HydrationBoundary>
        </div>
      </div>
    </div>
  )
}
