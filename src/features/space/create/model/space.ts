'use server'

import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/shared/config'

export async function revalidateSpaceList() {
  revalidateTag(CACHE_TAGS.SPACE.list()[0])
}
