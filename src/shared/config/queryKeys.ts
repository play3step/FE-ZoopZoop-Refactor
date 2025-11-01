import { SpaceStatus } from '@/entities/space'

export const QUERY_KEYS = {
  NEWS: {
    recommended: (folderId: string) => ['news', 'recommended', folderId]
  },
  USER: {
    me: () => ['user', 'me'],
    byName: (name: string) => ['user', name]
  },
  SPACE: {
    all: () => ['spaces'],
    allList: () => ['space-all'],
    pagination: (page: number, state?: SpaceStatus) => ['spaces', page, state]
  },
  SPACE_MEMBER: {
    list: (spaceId: number) => ['space-members', spaceId],
    pending: (spaceId: number) => ['space-pending-members', spaceId]
  },
  INVITATION: {
    list: () => ['invitations']
  },
  ARCHIVE_FOLDER: {
    all: () => ['archiveFolders']
  },
  ARCHIVE_FILE: {
    byFolder: (folderId: number) => ['archiveFilesPage', folderId],
    byPage: (
      folderId: number,
      page: number,
      sort: string,
      keyword?: string,
      isActive?: boolean
    ) => ['archiveFilesPage', folderId, page, sort, keyword, isActive]
  },
  SHARED_ARCHIVE: {
    byFolder: (spaceId: number) => ['spaceFile', spaceId],
    byPage: (
      spaceId: number,
      page: number,
      sort: string,
      keyword?: string,
      isActive?: boolean
    ) => ['spaceFile', spaceId, page, sort, keyword, isActive],
    all: () => ['spaceFile'],
    files: () => ['spaceFiles']
  }
}

export const MUTATION_KEYS = {
  AUTH: {
    delete: () => ['auth', 'delete']
  },
  USER: {
    updateProfile: () => ['user', 'update-profile'],
    updateNickname: () => ['user', 'update-nickname']
  },
  SPACE: {
    create: () => ['create-space'],
    delete: () => ['delete-space'],
    edit: () => ['edit-space'],
    leave: () => ['leave-member']
  },
  SPACE_MEMBER: {
    updateAuthority: () => ['update', 'authority'],
    add: () => ['add-member'],
    expel: () => ['expel-member']
  },
  INVITATION: {
    accept: () => ['invitation', 'accept'],
    cancel: () => ['invitation', 'cancel']
  },
  ARCHIVE_FOLDER: {
    create: () => ['archive-folder', 'create'],
    delete: () => ['archive-folder', 'delete'],
    update: () => ['archive-folder', 'update']
  },
  ARCHIVE_FILE: {
    deleteOne: () => ['archive-file', 'delete-one'],
    deleteMany: () => ['archive-file', 'delete-many'],
    editWithoutImg: () => ['archive-file', 'edit-without-img'],
    editWithImg: () => ['archive-file', 'edit-with-img'],
    upload: () => ['archive-file', 'upload'],
    restore: () => ['archive-file', 'restore'],
    moveToTrash: () => ['archive-file', 'move-to-trash'],
    moveMany: () => ['archive-file', 'move-many'],
    moveOne: () => ['archive-file', 'move-one']
  },
  SHARED_ARCHIVE: {
    deleteMany: () => ['space-file', 'delete-many'],
    editWithoutImg: () => ['space-file', 'edit-without-img'],
    editWithImg: () => ['space-file', 'edit-with-img'],
    restore: () => ['space-file', 'restore'],
    moveToTrash: () => ['space-file', 'move-to-trash'],
    copyToSpace: () => ['space-file', 'copy-to-space']
  }
}

export const CACHE_TAGS = {
  NEWS: {
    recommended: (folderId: string) => [`news-${folderId}`]
  },
  SPACE: {
    file: () => [`space-file`],
    list: () => [`spaces`]
  },
  ARCHIVE: {
    folder: () => ['archive-folder'],
    file: () => ['archive-file']
  }
}
