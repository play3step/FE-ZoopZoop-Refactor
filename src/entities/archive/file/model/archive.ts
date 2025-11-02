'use server'

import { CACHE_TAGS } from '@/shared/config'
import { revalidateTag } from 'next/cache'

export async function revalidateArchiveFiles() {
  revalidateTag(CACHE_TAGS.ARCHIVE.file()[0])
}
