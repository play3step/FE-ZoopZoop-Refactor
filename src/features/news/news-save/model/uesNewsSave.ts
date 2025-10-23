'use client'

import { useCopyToSpaceAction } from '@/features/shared-archive/import-file/model/useCopyToSpaceAction'
import { postArchiveFileClient } from '@/entities/archive/file'
import { showSuccessToast, showErrorToast } from '@/shared/ui/toast/Toast'
import { useState } from 'react'
import { useGetArchiveFoldersQuery } from '@/entities/archive/folder'

export const useNewsSave = (spaceId: string) => {
  const { foldersQuery } = useGetArchiveFoldersQuery()
  const folderList = foldersQuery.data?.data
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})
  const [selectedFolder] = useState<number | null>(
    folderList?.find(f => f.folderName === 'default')?.folderId ?? null
  )

  const { handleCopyToSpace } = useCopyToSpaceAction()

  const handlePost = async (newUrl: string) => {
    try {
      setLoadingMap(prev => ({ ...prev, [newUrl]: true }))
      const fileId = await postArchiveFileClient(selectedFolder, newUrl)

      if (spaceId && fileId.data?.dataSourceId) {
        await handleCopyToSpace(parseInt(spaceId), [
          {
            files: [
              {
                fileId: fileId.data?.dataSourceId,
                fileName: 'default'
              }
            ],
            folderId: selectedFolder ?? 0,
            folderName: 'default'
          }
        ])
      }
      showSuccessToast('파일 업로드 성공')
    } catch {
      showErrorToast('파일 업로드 중 오류 발생')
    } finally {
      setLoadingMap(prev => ({ ...prev, [newUrl]: false }))
    }
  }

  return { handlePost, loadingMap }
}
