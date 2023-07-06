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
import FetchWebsiteNode from "@/app/canvas/nodes/FetchWebsiteNode";
import SelectedIncomingEdge from "@/app/canvas/edges/SelectedIncomingEdge";
import SelectedOutgoingEdge from "@/app/canvas/edges/SelectedOutgoingEdge";
import DefaultEdge from "@/app/canvas/edges/DefaultEdge";
import BothSelectedEdge from "@/app/canvas/edges/BothSelectedEdge";

export type RFState = {
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

export const selectedColor = "#F98E35"

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

export const useReactFlowStore = create<RFState>((set, get) => ({
    nodes: [],
    selectedNodes: [],
    edges: [],
    nodeTypes: {
        fetchWebsiteNode: FetchWebsiteNode
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
        // Source and target node can not be the same
        if (connection.source !== connection.target) {
            set({
                edges: addEdge({
                    ...connection
                }, get().edges)
            });
        }
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
        console.log("Updated node data", data)
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

export default useReactFlowStore;