'use client'

import {
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  ConnectionMode,
  getNodesBounds,
  getViewportForBounds
} from '@xyflow/react'
import type { OnNodesChange } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useFlowState } from '../model/useFlowState'
import { CustomFlowNode } from './CustomFlowNode'
import { useCursor, useFlowDragDrop } from '@/features/dashboard'
import { FlowSidebar } from '../../flow-sidebar'

import { Cursor } from './Cursor'
import { CommentOverlay, FlowItemContainer } from '../../flow-item'
import { DashboardFile } from '@/entities/dashboard'
import { toPng } from 'html-to-image'
import { updateThumbnailClient } from '@/entities/thumbnail'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { SpaceQueryKey } from '@/entities/space'

const imageWidth = 1024
const imageHeight = 768

const nodeTypes = {
  custom: CustomFlowNode
}

const defaultEdgeOptions = {
  style: {
    strokeWidth: 3,
    stroke: '#666'
  }
}

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: '#666',
  strokeDasharray: '8,4',
  animation: 'dashdraw 0.5s linear infinite'
}

const FlowDashboardContent = ({ file }: { file: DashboardFile[] }) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodesDelete,
    setNodes
  } = useFlowState()

  const { onDrop, onDragOver } = useFlowDragDrop({ setNodes, nodes })

  const { others, handlePointerMove, handlePointerLeave, updateDraggingNode } =
    useCursor()
  const { flowToScreenPosition, screenToFlowPosition } = useReactFlow()

  const { id } = useParams()
  const queryClient = useQueryClient()

  const [isCreating, setIsCreating] = useState(false)
  const [newCommentPosition, setNewCommentPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  const flowContainerRef = useRef<HTMLDivElement | null>(null)

  // 썸네일 비콘 전송을 위한 최신 Blob 캐시
  const latestBlobRef = useRef<Blob | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 사용자별 로컬 선택 상태
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [myDraggingPosition, setMyDraggingPosition] = useState<{
    nodeId: string
    position: { x: number; y: number }
  } | null>(null)

  const handleNodesChange: OnNodesChange = changes => {
    // select 변화는 로컬 선택 상태에만 반영
    const select = changes.filter(c => c.type === 'select')
    if (select.length) {
      setSelectedIds(prev => {
        const next = new Set(prev)
        for (const c of select) {
          if ('selected' in c) {
            if (c.selected) next.add(c.id)
            else next.delete(c.id)
          }
        }
        return next
      })
    }

    // position 변화 처리
    const positionChanges = changes.filter(c => c.type === 'position')

    positionChanges.forEach(change => {
      if (change.type === 'position') {
        if (change.dragging && change.position) {
          // 드래그 중: Presence로 실시간 공유 + 로컬 state 업데이트
          updateDraggingNode(change.id, change.position)
          setMyDraggingPosition({
            nodeId: change.id,
            position: change.position
          })
        } else if (!change.dragging) {
          // 드래그 끝: Presence 초기화 + 로컬 state 초기화
          updateDraggingNode(null)
          setMyDraggingPosition(null)
        }
      }
    })

    // 드래그가 끝났을 때만 Storage에 반영
    const finishedDragChanges = changes.filter(
      c => c.type === 'position' && !c.dragging
    )

    const otherChanges = changes.filter(
      c => c.type !== 'select' && c.type !== 'position'
    )

    const changesToApply = [...finishedDragChanges, ...otherChanges]
    if (changesToApply.length > 0) {
      onNodesChange(changesToApply)
    }
  }

  const nodesWithOthersDragging = useMemo(() => {
    // 드래그 중인 노드 위치 수집 (내 것 + 다른 사람 것)
    const draggingMap = new Map<string, { x: number; y: number }>()

    // 1. 내 드래그 위치 추가 (최우선)
    if (myDraggingPosition) {
      draggingMap.set(myDraggingPosition.nodeId, myDraggingPosition.position)
    }

    // 2. 다른 사람들의 드래그 위치 추가
    others.forEach(other => {
      if (other.presence?.draggingNode) {
        const { nodeId, position } = other.presence.draggingNode
        // 내가 드래그 중인 노드가 아닌 경우만 추가
        if (!myDraggingPosition || myDraggingPosition.nodeId !== nodeId) {
          draggingMap.set(nodeId, position)
        }
      }
    })

    return nodes.map(n => ({
      ...n,
      // 드래그 중인 위치가 있으면 그 위치, 아니면 Storage의 원래 위치
      position: draggingMap.get(n.id) || n.position,
      // 내 로컬 선택 상태만 반영
      selected: selectedIds.has(n.id)
    }))
  }, [nodes, selectedIds, others, myDraggingPosition])

  const handlePaneClick = (event: React.MouseEvent) => {
    if (isCreating) {
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })

      setNewCommentPosition(flowPosition)
    }
  }
  const { getNodes } = useReactFlow()

  // 초기 진입 시점의 id를 고정
  const initialIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (id && !initialIdRef.current) {
      initialIdRef.current = String(id)
    }
  }, [id])

  const captureDataUrl = useCallback(async () => {
    const el = document.querySelector(
      '.react-flow__viewport'
    ) as HTMLElement | null
    if (!el) throw new Error('viewport not found')

    const nodesBounds = getNodesBounds(getNodes())
    const view = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      0.1
    )

    const transparentPx =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='

    return await toPng(el, {
      backgroundColor: '#ffffff',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`
      },
      imagePlaceholder: transparentPx,
      filter: node => {
        if (node instanceof HTMLImageElement) {
          const src = node.getAttribute('src') || ''
          if (!src) return false
        }
        return true
      }
    })
  }, [getNodes])

  // 노드/엣지 변경 시 썸네일 미리 생성하여 이탈 전송에 사용
  useEffect(() => {
    if (!nodes.length) return
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const dataUrl = await captureDataUrl()
        const blob = await (await fetch(dataUrl)).blob()
        latestBlobRef.current = blob
      } catch {}
    }, 1500)
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
  }, [nodes, edges, captureDataUrl])

  // 페이지 이탈/언마운트 시 keepalive PUT으로 자동 업로드
  useEffect(() => {
    const sendAutoSave = async () => {
      const sid = initialIdRef.current
      if (!sid) return
      let blob = latestBlobRef.current
      if (!blob) {
        try {
          const dataUrl = await captureDataUrl()
          const freshBlob = await (await fetch(dataUrl)).blob()
          latestBlobRef.current = freshBlob
          blob = freshBlob
        } catch {}
      }
      if (!blob) return
      const form = new FormData()
      const file = new File([blob], 'flow.png', { type: 'image/png' })
      form.append('image', file)
      try {
        await updateThumbnailClient(Number(id), file)
        await queryClient.invalidateQueries({
          queryKey: [SpaceQueryKey]
        })
      } catch {}
    }

    const handleVisibility = () => {
      if (document.hidden) {
        void sendAutoSave()
      }
    }
    const handlePageHide = () => {
      void sendAutoSave()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('beforeunload', handlePageHide)

    return () => {
      void sendAutoSave()
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('beforeunload', handlePageHide)
    }
  }, [])

  return (
    <div className="flex w-full h-screen relative">
      <FlowSidebar
        file={file}
        nodes={nodes}
      />
      <div
        className="flex-1 relative overflow-hidden"
        ref={flowContainerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}>
        {others
          .filter(other => other.presence?.cursor !== null)
          .map(({ connectionId, presence, info }) => {
            if (!presence.cursor) return null
            const screenPosition = flowToScreenPosition({
              x: presence.cursor.x,
              y: presence.cursor.y
            })
            const bounds = flowContainerRef.current?.getBoundingClientRect()
            const x = bounds ? screenPosition.x - bounds.left : screenPosition.x
            const y = bounds ? screenPosition.y - bounds.top : screenPosition.y

            return (
              <Cursor
                key={connectionId}
                x={x}
                y={y}
                name={info?.name}
                color={`hsl(${(connectionId.toString().charCodeAt(0) * 137.5) % 360}, 70%, 50%)`}
              />
            )
          })}
        <ReactFlow
          nodes={nodesWithOthersDragging}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineStyle={connectionLineStyle}
          connectionMode={ConnectionMode.Loose}
          connectionRadius={60}
          fitView
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={handlePaneClick}
          zoomOnScroll={false}
          className={isCreating ? 'cursor-crosshair' : ''}>
          <MiniMap position="top-right" />
          <Controls position="top-left" />
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
          />
        </ReactFlow>

        <FlowItemContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
        />
        <CommentOverlay
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          newCommentPosition={newCommentPosition}
          setNewCommentPosition={setNewCommentPosition}
          containerRef={flowContainerRef as RefObject<HTMLDivElement>}
        />
      </div>
    </div>
  )
}

export const FlowDashboard = ({ file }: { file: DashboardFile[] }) => {
  return (
    <ReactFlowProvider>
      <FlowDashboardContent file={file} />
    </ReactFlowProvider>
  )
}
