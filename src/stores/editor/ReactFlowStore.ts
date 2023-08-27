import create from 'zustand';
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    NodeProps,
    OnConnect,
    OnEdgesChange,
    OnNodesChange
} from 'reactflow';
import {
    connectionRules,
    getAllowedValueTypes, getConnectionRule,
    getMaxConnections,
    getOutputValueType,
    isConnectionAllowed
} from "@/config/ConnectionRules";
import {openWarningSnackBar} from "@/stores/editor/EditorPageStore";
import {ReactNode} from "react";
import {getAllNodesMetadata, NodeMetadata} from "@/config/NodesMetadata";
import {NodeType} from "@/config/NodeType";
import {
    BothSelectedEdge,
    DefaultEdge,
    EdgeSelectedEdge,
    highlightEdges,
    SelectedIncomingEdge,
    SelectedOutgoingEdge
} from "@/components/editor/pages/canvas/edges/Edges";
import {selectedColor} from "@/config/colors";

export const handleStyle = (isNodeSelected: boolean) => {
    return {
        width: 12,
        height: 12,
        backgroundColor: isNodeSelected ? selectedColor : "#9BA8BD"
    }
}

export type ReactFlowState = {
    nodes: Node[];
    selectedNodes: Node[]
    edges: Edge[];
    currentConnectionStartNode: Node | null
    isConnectionHighlightingActivated: boolean
    setCurrentConnectionStartNode: (node: Node | null) => void
    setIsConnectionHighlightingActivated: (isActivated: boolean) => void
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateNodeData: <NodeData>(nodeId: string, data: NodeData) => void;
    getNodeById: (nodeId: string) => Node | null;
    setNodeSelected: (nodeId: string | null) => void
    setSelectedNodes: () => void
    removeIllegalEdgesAfterDynamicNodeChange: (nodeType: NodeType, nodeId: string) => void
    updateEdgesGradient: () => void
}

export const useReactFlowStore = create<ReactFlowState>((set, get) => ({
    nodes: [],
    selectedNodes: [],
    edges: [],
    nodeTypes: getAllNodesMetadata().reduce<Record<string, ({ id, selected, data }: NodeProps) => ReactNode>>((acc, info: NodeMetadata) => {
        acc[info.type] = info.getNodeComponent
        return acc
    }, {}),
    currentConnectionStartNode: null,
    isConnectionHighlightingActivated: false,
    setCurrentConnectionStartNode: (node: Node | null) => {
        set({
            currentConnectionStartNode: node
        })
    },
    setIsConnectionHighlightingActivated: (isActivated: boolean) => {
        set({
            isConnectionHighlightingActivated: isActivated
        })
        get().updateEdgesGradient()
    },
    edgeTypes: {
        defaultEdge: DefaultEdge,
        selectedIncomingEdge: SelectedIncomingEdge,
        selectedOutgoingEdge: SelectedOutgoingEdge,
        bothSelectedEdge: BothSelectedEdge,
        edgeSelectedEdge: EdgeSelectedEdge,
        ...highlightEdges,
    },
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {

        // TODO Überlegen, ob ich bei Nodes mit mehreren Inputs verschiedene Typen von Inputs zulassen möchte (HTML und JSON kombiniert bspw.)
        // Vielleicht wäre es eine sinnvolle ergänzung den Benutzer daran zu hindern ein HTML Edge an einen Node zu heften, der bereits einen JSON Edge hat
        // Ich kann das dem Benutzer über ein Popup erklären und fragen, ob er die alten durch den neuen austauschen möchte

        const source = connection.source
        const target = connection.target

        if (!source || !target) {
            return
        }

        const sourceNode = get().getNodeById(source)
        const targetNode = get().getNodeById(target)

        if (!sourceNode || !targetNode) {
            return
        }

        // Check connectivity rules

        if (source === target) {
            openWarningSnackBar("You can't connect a node to itself")
            return
        }

        const sourceNodeType = sourceNode.type as NodeType
        const targetNodeType = targetNode.type as NodeType

        const pipelineValueType = getOutputValueType(sourceNodeType, source)

        if (!isConnectionAllowed(pipelineValueType, targetNodeType, target, connection.targetHandle)) {
            openWarningSnackBar(`You can't connect a "${
                getOutputValueType(sourceNodeType, source)
            }" output to a "${
                getAllowedValueTypes(targetNodeType, target,  connection.targetHandle).join("/")
            }" input`)
            return
        }

        const existingConnectionsToTarget = get().edges.filter(edge => edge.target === target && edge.targetHandle === connection.targetHandle).length
        const maxConnectionsToTarget = getMaxConnections(targetNodeType, target, connection.targetHandle)
        const isMaxConnectionsReached = maxConnectionsToTarget && existingConnectionsToTarget >= maxConnectionsToTarget

        if (isMaxConnectionsReached) {
            openWarningSnackBar("The max amount of inputs for this node is reached")
            return
        }

        console.log("Added edge", sourceNode, targetNode, connection, connectionRules)

        set({
            edges: addEdge({
                ...connection
            }, get().edges)
        });
        get().updateEdgesGradient()
    },
    updateNodeData: <NodeData>(nodeId: string, data: NodeData) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    node.data = data;
                }
                return node;
            }),
        });
    },
    getNodeById: (nodeId: string): Node | null => {
        let resultNode = null
        get().nodes.forEach((node) => {
            if (node.id === nodeId) {
                resultNode = node
            }
        })
        return resultNode;
    },
    setNodeSelected: (nodeId: string | null) => {
        set({
            nodes: get().nodes.map(node => {
                node.selected =  nodeId !== null && node.id === nodeId
                return node
            })
        })
        get().setSelectedNodes()
    },
    setSelectedNodes: () => {
        set({
            selectedNodes: get().nodes.filter(node =>
                node.selected
            )
        })
        get().updateEdgesGradient()
    },
    removeIllegalEdgesAfterDynamicNodeChange: (nodeType: NodeType, nodeId: string) => {
        const availableHandleIds = getConnectionRule(nodeType, nodeId)?.inputRules.map(rule => rule.handleId)
        if (!availableHandleIds) {
            return
        }
        set({
            edges: get().edges.filter(edge => {
                // TODO Filter illegal edges when their pipeline datavalue does not fit anymore after a change
                if (edge.source !== nodeId && edge.target !== nodeId) {
                    return true
                }
                if (!edge.targetHandle) {
                    return false
                }
                return availableHandleIds.includes(edge.targetHandle)
            })
        })
    },
    updateEdgesGradient() {
        const selectedNodeIds = get().selectedNodes.map(node => node.id)

        if (!get().isConnectionHighlightingActivated) {

            set({
                edges: get().edges.map(edge => {
                    if (selectedNodeIds.length === 0 && edge.selected) {
                        return {
                            ...edge,
                            type: "edgeSelectedEdge"
                        }
                    }
                    if (selectedNodeIds.includes(edge.source) && selectedNodeIds.includes(edge.target)) {
                        return {
                            ...edge,
                            type: "bothSelectedEdge"
                        }
                    }
                    if (selectedNodeIds.includes(edge.source)) {
                        return {
                            ...edge,
                            type: "selectedOutgoingEdge"
                        }
                    }
                    if (selectedNodeIds.includes(edge.target)) {
                        return {
                            ...edge,
                            type: "selectedIncomingEdge"
                        }
                    }
                    return {
                        ...edge,
                        type: "defaultEdge"
                    }
                }).sort((a, b) => {
                    if (a.type === "edgeSelectedEdge") {
                        return 1
                    }
                    if (b.type === "edgeSelectedEdge") {
                        return -1
                    }
                    if (a.type === "defaultEdge") {
                        return -1
                    }
                    if (b.type === "defaultEdge") {
                        return 1
                    }
                    return 0
                })
            })

        } else {

            set({
                edges: get().edges.map(edge => {

                    const sourceNodeType = get().getNodeById(edge.source)?.type as NodeType
                    return {
                        ...edge,
                        type: sourceNodeType && getOutputValueType(sourceNodeType, edge.source)?.toString() || "defaultEdge"
                    }
                })
            })

        }
    }
}));

export default useReactFlowStore;