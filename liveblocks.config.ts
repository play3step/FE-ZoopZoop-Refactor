declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null
      draggingNode: {
        nodeId: string
        position: { x: number; y: number }
      } | null
    }

    Storage: {
      nodes: {
        id: string
        type: string
        position: { x: number; y: number }

        data: {
          imageUrl: string
          category: string
          title: string
          content: string
          link: string
          user: {
            name: string
            profileUrl: string
          }
        }
      }[]

      edges: {
        id: string
        source: string
        target: string
      }[]
    }

    UserMeta: {
      id: string
      info: {
        name: string
        avatar?: string
      }
    }

    RoomEvent: Record<string, never>

    ThreadMetadata: {
      x: number
      y: number
      zIndex: number
      resolved?: boolean
    }

    RoomInfo: Record<string, never>
  }
}

export {}
