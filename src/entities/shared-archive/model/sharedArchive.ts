'use server'

import { CACHE_TAGS } from '@/shared/config'
import { revalidateTag } from 'next/cache'

export async function revalidateSpaceFiles() {
  revalidateTag(CACHE_TAGS.SPACE.file()[0])
}
