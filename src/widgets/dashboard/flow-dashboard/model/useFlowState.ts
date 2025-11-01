'use client'

import { useCallback } from 'react'
import {
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Edge,
  Node,
  OnNodesDelete,
  getIncomers,
  getOutgoers,
  getConnectedEdges
} from '@xyflow/react'
import { useStorage, useMutation } from '@liveblocks/react'

export const useFlowState = () => {
  const nodes = useStorage(root => root.nodes) as Node[] | null
  const edges = useStorage(root => root.edges) as Edge[] | null

  const updateNodes = useMutation(({ storage }, newNodes: Node[]) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storage.set('nodes', newNodes as any)
    } catch {
      // do nothing
    }
  }, [])

  const updateEdges = useMutation(({ storage }, newEdges: Edge[]) => {
    try {
      storage.set('edges', newEdges)
    } catch {
      // do nothing
    }
  }, [])

  const onNodesChange: OnNodesChange = useCallback(
    changes => {
      if (!nodes) return
      const newNodes = applyNodeChanges(changes, nodes)

      const nodesToStore = newNodes.map(node => {
        const { selected, ...rest } = node
        return rest
      })

      updateNodes(nodesToStore)
    },
    [nodes, updateNodes]
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    changes => {
      if (!edges) return
      const newEdges = applyEdgeChanges(changes, edges)
      updateEdges(newEdges)
    },
    [edges, updateEdges]
  )

  const onConnect: OnConnect = useCallback(
    connection => {
      if (!edges) return
      const newEdges = addEdge({ ...connection }, edges)
      updateEdges(newEdges)
    },
    [edges, updateEdges]
  )

  const onNodesDelete: OnNodesDelete = useCallback(
    deleted => {
      if (!nodes || !edges) return
      let remainingNodes = [...nodes]
      const newEdges = deleted.reduce((acc, node) => {
        const incomers = getIncomers(node, remainingNodes, acc)
        const outgoers = getOutgoers(node, remainingNodes, acc)
        const connectedEdges = getConnectedEdges([node], acc)

        const remainingEdges = acc.filter(
          edge => !connectedEdges.includes(edge)
        )

        const createdEdges = incomers.flatMap(({ id: source }) =>
          outgoers.map(({ id: target }) => ({
            id: `${source}->${target}`,
            source,
            target
          }))
        )

        remainingNodes = remainingNodes.filter(rn => rn.id !== node.id)
        return [...remainingEdges, ...createdEdges]
      }, edges)

      const nodesToStore = remainingNodes.map(node => {
        const { selected, ...rest } = node
        return rest
      })

      updateNodes(nodesToStore)
      updateEdges(newEdges)
    },
    [nodes, edges, updateNodes, updateEdges]
  )

  const setNodes = useCallback(
    (newNodes: Node[] | ((nodes: Node[]) => Node[])) => {
      if (!nodes) return
      const updatedNodes =
        typeof newNodes === 'function' ? newNodes(nodes) : newNodes

      const nodesToStore = updatedNodes.map(node => {
        const { selected, ...rest } = node
        return rest
      })

      updateNodes(nodesToStore)
    },
    [nodes, updateNodes]
  )

  return {
    nodes: nodes || [],
    edges: edges || [],
    setNodes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodesDelete
  }
}
