import { fetchRecommendedNewServer } from '@/entities/news'
import { requireAuth } from '@/shared/lib/api-route'
import { NextResponse } from 'next/server'

export const GET = async ({ params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const response = await requireAuth(async token => {
      return await fetchRecommendedNewServer(id, { token })
    })
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({
      status: 500,
      data: null,
      msg: error instanceof Error ? error.message : '요청 처리 중 오류 발생'
    })
  }
}
