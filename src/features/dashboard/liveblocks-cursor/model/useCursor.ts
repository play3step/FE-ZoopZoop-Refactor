'use client'

import { useMyPresence, useOthers } from '@liveblocks/react'
import { useReactFlow } from '@xyflow/react'

export const useCursor = () => {
  const [myPresence, updateMyPresence] = useMyPresence()
  const others = useOthers()
  const { screenToFlowPosition } = useReactFlow()

  function handlePointerMove(e: React.PointerEvent) {
    const cursor = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY
    })
    updateMyPresence({ cursor })
  }

  function handlePointerLeave() {
    updateMyPresence({ cursor: null })
  }

  // 드래그 중인 노드 정보
  function updateDraggingNode(
    nodeId: string | null,
    position?: { x: number; y: number }
  ) {
    if (nodeId && position) {
      updateMyPresence({ draggingNode: { nodeId, position } })
    } else {
      updateMyPresence({ draggingNode: null })
    }
  }

  return {
    myPresence,
    others,
    handlePointerMove,
    handlePointerLeave,
    updateDraggingNode
  }
}
