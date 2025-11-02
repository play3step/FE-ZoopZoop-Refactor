import { useEditSpaceFileQuery } from '@/entities/shared-archive/model/queries'
import { useModalStore } from '@/shared/lib'
import { BadgeCategory } from '@/shared/ui/badge/Badge'
import { showSuccessToast } from '@/shared/ui/toast/Toast'
import { useRouter } from 'next/navigation'

export const useEditSpaceFileAction = () => {
  const closeModal = useModalStore(s => s.closeModal)
  const router = useRouter()
  const { editFileWithoutImg, editFileWithImg } = useEditSpaceFileQuery()
  const handleEdit = ({
    newTags,
    selectedFile,
    spaceId,
    dataSourceId,
    newTitle,
    newCategory,
    newSummary,
    newSourceUrl,
    newSource,
    previewUrl
  }: {
    newTags: string
    selectedFile: File | null
    spaceId: number
    dataSourceId: number
    newTitle: string
    newCategory: string
    newSummary: string
    newSourceUrl: string
    newSource: string
    previewUrl: string
  }) => {
    // # 붙은 태그 문자열을 배열로 변환
    const tagsArray: string[] = newTags
      ? newTags
          .split(' ')
          .map(tag => tag.trim())
          .filter(tag => tag.startsWith('#')) // '#' 붙은 것만
          .map(tag => tag.slice(1))
      : [] // '#' 제거

    if (selectedFile) {
      editFileWithImg.mutate(
        {
          spaceId: spaceId,
          dataSourceId: dataSourceId,
          payload: {
            title: newTitle ?? '',
            category: newCategory as BadgeCategory,
            summary: newSummary ?? '',
            sourceUrl: newSourceUrl ?? '',
            source: newSource ?? '',
            tags: tagsArray ?? []
          },
          image: selectedFile
        },
        {
          onSuccess: () => {
            showSuccessToast('수정 완료')
            closeModal()
          }
        }
      )
    } else {
      editFileWithoutImg.mutate(
        {
          spaceId: spaceId,
          dataSourceId,
          title: newTitle ?? '',
          category: newCategory as BadgeCategory,
          summary: newSummary ?? '',
          sourceUrl: newSourceUrl ?? '',
          source: newSource ?? '',
          tags: tagsArray ?? [],
          imageUrl: previewUrl
        },
        {
          onSuccess: () => {
            showSuccessToast('수정 완료')
            closeModal()
            router.refresh()
          }
        }
      )
    }
  }
  return {
    handleEdit,
    isPending: editFileWithImg.isPending || editFileWithoutImg.isPending
  }
}
