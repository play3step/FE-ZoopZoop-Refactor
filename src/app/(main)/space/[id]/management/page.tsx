import {
  getSpaceMemberList,
  getSpacePendingMemberList
} from '@/entities/space/member/api/member.ssr'
import { QUERY_KEYS } from '@/shared/config'
import { Separator } from '@/shared/ui/shadcn/separator'
import {
  MemberTableSkeleton,
  SpaceDangerSection,
  SpaceInfo,
  SpaceMemberManagement
} from '@/widgets'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import { Suspense } from 'react'

interface Props {
  params: Promise<{ id: string }>
}

const SpaceManagementPage = async ({ params }: Props) => {
  const { id } = await params
  const numericId = Number(id)
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.SPACE_MEMBER.list(numericId),
      queryFn: () => getSpaceMemberList(numericId)
    }),
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.SPACE_MEMBER.pending(numericId),
      queryFn: () => getSpacePendingMemberList(numericId)
    })
  ])

  return (
    <div className="flex-center flex-col p-8 max-w-[1200px] m-auto">
      {/* 스페이스 인포 */}
      <SpaceInfo />
      <Separator className="my-10" />
      {/* 스페이스 맴버 테이블 */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MemberTableSkeleton />}>
          <SpaceMemberManagement spaceId={numericId} />
        </Suspense>
      </HydrationBoundary>
      <Separator className="my-10" />
      {/* 스페이스 삭제 및 탈퇴 */}
      <SpaceDangerSection />
    </div>
  )
}
export default SpaceManagementPage
