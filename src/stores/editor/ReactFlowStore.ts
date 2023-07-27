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
import DefaultEdge from "@/components/editor/pages/canvas/edges/DefaultEdge";
import SelectedIncomingEdge from "@/components/editor/pages/canvas/edges/SelectedIncomingEdge";
import SelectedOutgoingEdge from "@/components/editor/pages/canvas/edges/SelectedOutgoingEdge";
import BothSelectedEdge from "@/components/editor/pages/canvas/edges/BothSelectedEdge";
import {connectionRules} from "@/config/ConnectionRules";
import {openWarningSnackBar} from "@/stores/editor/EditorPageStore";
import {ReactNode} from "react";
import {selectedColor} from "@/app/layout";
import {getAllNodesMetadata} from "@/config/NodesMetadata";
import {NodeMetadata} from "@/components/editor/pages/canvas/nodes/util/Creators";

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
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateNodeData: <NodeData>(nodeId: string, data: NodeData) => void;
    getNodeById: (nodeId: string) => Node | null;
    setNodeSelected: (nodeId: string | null) => void
    setSelectedNodes: () => void
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
    edgeTypes: {
        defaultEdge: DefaultEdge,
        selectedIncomingEdge: SelectedIncomingEdge,
        selectedOutgoingEdge: SelectedOutgoingEdge,
        bothSelectedEdge: BothSelectedEdge
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

        const pipelineValueType = connectionRules.find(rule => rule.nodeType === sourceNode.type)?.outputValueType
        const isConnectionAllowed = pipelineValueType && connectionRules.find(rule =>
            rule.nodeType === targetNode.type
        )?.inputRules.find(rule => {
            return rule.handleId === connection.targetHandle
        })?.allowedValueTypes?.includes(pipelineValueType)

        if (!isConnectionAllowed) {
            openWarningSnackBar(`You can't connect a "${
                connectionRules.find(rule => rule.nodeType === sourceNode.type)?.outputValueType
            }" output to a "${
                connectionRules.find(rule => rule.nodeType === targetNode.type)?.inputRules.find(rule => 
                    rule.handleId === connection.targetHandle
                )?.allowedValueTypes.join("/")
            }" input`)
            return
        }

        const existingConnectionsToTarget = get().edges.filter(edge => edge.target === target && edge.targetHandle === connection.targetHandle).length
        const maxConnectionsToTarget = connectionRules.find(rule =>
            rule.nodeType === targetNode.type
        )?.inputRules.find(rule => {
            return rule.handleId === connection.targetHandle
        })?.maxConnections
        const isMaxConnectionsReached = maxConnectionsToTarget && existingConnectionsToTarget >= maxConnectionsToTarget

        if (isMaxConnectionsReached) {
            openWarningSnackBar("The max amount of inputs for this node is reached")
            return
        }

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
    updateEdgesGradient() {
        const selectedNodeIds = get().selectedNodes.map(node => node.id)

        set({
            edges: get().edges.map(edge => {
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
            })
        })
    }
}));

export default useReactFlowStore;