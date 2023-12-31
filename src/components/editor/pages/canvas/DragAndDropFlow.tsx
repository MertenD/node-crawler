'use client'

import ReactFlow, {
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    MiniMap,
    Node,
    OnConnectStartParams,
    Panel,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import shallow from 'zustand/shallow';
import {useReactFlowStore} from "@/stores/editor/ReactFlowStore";
import React, {useCallback, useRef, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import NodesToolbar from "@/components/editor/pages/canvas/toolbars/NodesToolbar";
import './DragAndDropFlowStyles.css'
import './edges/EdgeGradientStyles.css'
import OptionsToolbar from "@/components/editor/pages/canvas/toolbars/OptionsToolbar";
import {usePlayStore} from "@/stores/editor/PlayStore";
import OnCanvasNodesToolbar from "@/components/editor/pages/canvas/toolbars/OnCanvasNodesSelector";
import {getConnectionRule} from "@/config/ConnectionRules";
import {nodesMetadataMap} from "@/config/NodesMetadata";
import {NodeType} from "@/config/NodeType";
import {selectedColor, toolbarBackgroundColor} from "@/config/colors";

const selector = (state: any) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    nodeTypes: state.nodeTypes,
    edgeTypes: state.edgeTypes,
    getNodeById: state.getNodeById,
    setCurrentConnectionStartNode: state.setCurrentConnectionStartNode
});

export default function DragAndDropFlow() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, nodeTypes, edgeTypes, getNodeById, setCurrentConnectionStartNode } = useReactFlowStore(selector, shallow)

    const setSelectedNodes = useReactFlowStore((state) => state.setSelectedNodes)

    const connectStartParams = useRef<OnConnectStartParams | null>(null)
    const reactFlowWrapper = useRef(null)
    const reactFlowInstance = useReactFlow()

    const [isOnCanvasNodeSelectorOpen, setIsOnCanvasNodeSelectorOpen] = useState(false)
    const [lastEventPosition, setLastEventPosition] = useState<{x: number, y: number}>({x: 0, y: 0})

    const isProcessRunning = usePlayStore(state => state.isProcessRunning)
    const isStepByStep = usePlayStore(state => state.isStepByStep)
    const isNextStepReady = usePlayStore(state => state.isNextStepReady)

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: any) => {
        event.preventDefault();

        // @ts-ignore
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const { nodeType, nodeData } = JSON.parse(event.dataTransfer.getData('application/reactflow'));

        // check if the dropped element is valid
        if (typeof nodeType === 'undefined' || !nodeType) {
            return;
        }

        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        addNodeAtPosition(position, nodeType, nodeData)
    }, [reactFlowInstance]);

    const onConnectStart = useCallback((event: any, node: OnConnectStartParams) => {
        connectStartParams.current = node;
        setCurrentConnectionStartNode(getNodeById(node.nodeId))
    }, []);

    const onConnectEnd = useCallback(
        (event: any) => {
            setCurrentConnectionStartNode(null)
            const targetIsPane = event.target.classList.contains('react-flow__pane');
            const targetIsChallengeNode = event.target.parentElement.classList.contains("react-flow__node-challengeNode")

            if ((targetIsPane || targetIsChallengeNode) && connectStartParams.current?.handleType === "source" && reactFlowWrapper.current !== null) {
                // @ts-ignore
                const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
                setLastEventPosition({ x: event.clientX - left, y: event.clientY - top })
                setIsOnCanvasNodeSelectorOpen(true)
            }
        },
        [reactFlowInstance.project]
    );

    function addNodeAtPosition(position: {x: number, y: number}, nodeType: NodeType, data: any = {}): string {
        let yOffset = 0
        let zIndex = 0

        let nodeInfo = nodesMetadataMap[nodeType]
        if(nodeInfo && nodeInfo.style.minHeight && typeof nodeInfo.style.minHeight === "number") {
            yOffset += nodeInfo.style.minHeight / 2
        }

        const id = uuidv4();
        const newNode = {
            id,
            type: nodeType,
            position: { ...position, y: position.y - yOffset },
            zIndex: zIndex,
            data: data,
        } as Node;

        reactFlowInstance.addNodes(newNode);

        return id
    }

    return (
        <ReactFlow ref={reactFlowWrapper}
                   nodes={nodes}
                   edges={edges}
                   onNodesChange={onNodesChange}
                   onEdgesChange={onEdgesChange}
                   onConnect={onConnect}
                   onConnectStart={onConnectStart}
                   onConnectEnd={onConnectEnd}
                   onDragOver={onDragOver}
                   onDrop={onDrop}
                   nodeTypes={nodeTypes}
                   edgeTypes={edgeTypes}
                   snapToGrid={true}
                   selectNodesOnDrag={false}
                   defaultEdgeOptions={{
                       type: "defaultEdge"
                   }}
                   deleteKeyCode={["Backspace", "Delete"]}
                   onSelectionChange={setSelectedNodes}
                   edgesUpdatable={isProcessRunning ? (isStepByStep ? isNextStepReady : false) : true}
                   edgesFocusable={isProcessRunning ? (isStepByStep ? isNextStepReady : false) : true}
                   nodesDraggable={isProcessRunning ? (isStepByStep ? isNextStepReady : false) : true}
                   nodesConnectable={isProcessRunning ? (isStepByStep ? isNextStepReady : false) : true}
                   nodesFocusable={isProcessRunning ? (isStepByStep ? isNextStepReady : false) : true}
                   elementsSelectable={isProcessRunning ? (isStepByStep ? isNextStepReady : false) : true}
        >
            <Controls />
            <Background variant={BackgroundVariant.Dots} />
            <Panel position="top-left">
                <NodesToolbar />
            </Panel>
            <Panel position="top-right">
                <OptionsToolbar />
            </Panel>
            <MiniMap nodeColor={selectedColor} nodeStrokeWidth={3} zoomable pannable style={{
                backgroundColor: toolbarBackgroundColor
            }} />
            <OnCanvasNodesToolbar
                sourceNode={
                    useReactFlowStore.getState().getNodeById(connectStartParams.current?.nodeId || "")
                }
                open={isOnCanvasNodeSelectorOpen}
                position={lastEventPosition}
                onClose={(nodeType: NodeType | null) => {
                    setIsOnCanvasNodeSelectorOpen(false)

                    if (nodeType !== null && connectStartParams.current !== null && connectStartParams.current?.nodeId !== null) {
                        const id = addNodeAtPosition(reactFlowInstance.project(lastEventPosition), nodeType)
                        let rule = getConnectionRule(nodeType, id)
                        if(rule && rule.inputRules && rule.inputRules.length > 0) {
                            onConnect({
                                source: connectStartParams.current?.nodeId,
                                target: id,
                                sourceHandle: connectStartParams.current?.handleId,
                                // TODO Eventuell abändern, sobald ich dynamische nodes in dem onCanvasSelect drin hab
                                targetHandle: rule.inputRules[0].handleId
                            } as Connection)
                        }
                    }
                }}
            />
        </ReactFlow>
    );
}