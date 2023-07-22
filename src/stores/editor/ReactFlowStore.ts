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
    OnConnect,
    OnEdgesChange,
    OnNodesChange
} from 'reactflow';
import FetchWebsiteNode from "@/components/editor/pages/edit/nodes/FetchWebsiteNode";
import DefaultEdge from "@/components/editor/pages/edit/edges/DefaultEdge";
import SelectedIncomingEdge from "@/components/editor/pages/edit/edges/SelectedIncomingEdge";
import SelectedOutgoingEdge from "@/components/editor/pages/edit/edges/SelectedOutgoingEdge";
import BothSelectedEdge from "@/components/editor/pages/edit/edges/BothSelectedEdge";
import StartNode from "@/components/editor/pages/edit/nodes/StartNode";
import SaveNode from "@/components/editor/pages/edit/nodes/SaveNode";
import {connectionRules} from "@/config/ConnectionRules";
import useEditorPageState from "@/stores/editor/EditorPageStore";

export const selectedColor = "#F98E35"
export const selectedColorHover = "#AE6325"
export const disabledColor = "#9BA8BD33"

export const nodeBackgroundColor = "#1A202C"
export const nodeShadowColor = "#1b2631"

export const toolbarBackgroundColor = "#1A202C"

export const defaultEdgeColor = "#9BA8BD"

export const handleStyle = (isNodeSelected) => {
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
    setSelectedNodes: () => Node[]
    updateEdgesGradient: () => void
}

export const useReactFlowStore = create<ReactFlowState>((set, get) => ({
    nodes: [],
    selectedNodes: [],
    edges: [],
    nodeTypes: {
        fetchWebsiteNode: FetchWebsiteNode,
        startNode: StartNode,
        saveNode: SaveNode
    },
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

        const sourceNode = get().getNodeById(connection.source)
        const targetNode = get().getNodeById(connection.target)

        // Check connectivity rules
        const pipelineValueType = connectionRules.find(rule => rule.nodeType === sourceNode.type)?.outputValueType
        const isConnectionAllowed = connectionRules.find(rule =>
            rule.nodeType === targetNode.type
        )?.inputRules.find(rule => {
            return rule.handleId === connection.targetHandle
        })?.allowedValueTypes?.includes(pipelineValueType)

        const existingConnectionsToTarget = get().edges.filter(edge => edge.target === connection.target && edge.targetHandle === connection.targetHandle).length
        const isMaxConnectionsReached = existingConnectionsToTarget >= connectionRules.find(rule =>
            rule.nodeType === targetNode.type
        )?.inputRules.find(rule => {
            return rule.handleId === connection.targetHandle
        }).maxConnections

        if (connection.source === connection.target) {
            openWarningSnackBar("You can't connect a node to itself")
            return
        }

        if (!isConnectionAllowed) {
            openWarningSnackBar("This connection is not allowed")
            return
        }

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

function openWarningSnackBar(message: string) {
    useEditorPageState.getState().setSnackBarSeverity("warning")
    useEditorPageState.getState().setSnackBarText(message)
    useEditorPageState.getState().setIsSnackBarOpen(true)
}

export default useReactFlowStore;