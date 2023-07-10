'use client'

import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    Node,
    OnConnectStartParams,
    Panel,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import shallow from 'zustand/shallow';
import {selectedColor, toolbarBackgroundColor, useReactFlowStore} from "@/stores/ReactFlowStore";
import React, {useCallback, useRef, useState} from "react";
import {NodeTypes} from "@/model/NodeTypes";
import {v4 as uuidv4} from 'uuid';
import OnCanvasNodesToolbar from "@/modules/editor/toolbars/OnCanvasNodesSelector";
import NodesToolbar from "@/modules/editor/toolbars/NodesToolbar";
import './DragAndDropFlowStyles.css'
import OptionsToolbar from "@/modules/editor/toolbars/OptionsToolbar";
import getNodesInformation from "@/modules/editor/toolbars/util/NodesInformation";

const selector = (state: any) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    nodeTypes: state.nodeTypes,
    edgeTypes: state.edgeTypes
});

export default function DragAndDropFlow() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, nodeTypes, edgeTypes } = useReactFlowStore(selector, shallow);

    const setSelectedNodes = useReactFlowStore((state) => state.setSelectedNodes)

    const connectStartParams = useRef<OnConnectStartParams | null>(null);
    const reactFlowWrapper = useRef(null);
    const reactFlowInstance = useReactFlow();

    const [openOnCanvasNodeSelector, setOpenOnCanvasNodeSelector] = React.useState(false);
    const [lastEventPosition, setLastEventPosition] = React.useState<{x: number, y: number}>({x: 0, y: 0})
    const [isDragging, setIsDragging] = useState(false)

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
    }, []);

    const onConnectEnd = useCallback(
        (event: any) => {
            const targetIsPane = event.target.classList.contains('react-flow__pane');
            const targetIsChallengeNode = event.target.parentElement.classList.contains("react-flow__node-challengeNode")

            if ((targetIsPane || targetIsChallengeNode) && connectStartParams.current?.handleType === "source" && reactFlowWrapper.current !== null) {
                // @ts-ignore
                const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
                setLastEventPosition({ x: event.clientX - left, y: event.clientY - top })
                setOpenOnCanvasNodeSelector(true)
            }
        },
        [reactFlowInstance.project]
    );

    function addNodeAtPosition(position: {x: number, y: number}, nodeType: NodeTypes, data: any = {}): string {
        let yOffset = 0
        let zIndex = 0

        yOffset += getNodesInformation().find(info => info.type === nodeType).style.minHeight / 2

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

    const onNodeDragStart = useCallback(() => {
        setIsDragging(true)
    }, [])

    const onNodeDragStop = useCallback(() => {
        setIsDragging(false)
    }, [])

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
                   onNodeDragStart={onNodeDragStart}
                   onNodeDragStop={onNodeDragStop}
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
                open={openOnCanvasNodeSelector}
                position={lastEventPosition}
                onClose={(nodeType: NodeTypes | null) => {
                    setOpenOnCanvasNodeSelector(false)

                    if (nodeType !== null && connectStartParams.current !== null && connectStartParams.current?.nodeId !== null) {
                        const id = addNodeAtPosition(reactFlowInstance.project(lastEventPosition), nodeType)
                        reactFlowInstance.addEdges({
                            id,
                            source: connectStartParams.current?.nodeId || "",
                            sourceHandle: connectStartParams.current?.handleId,
                            target: id
                        });
                    }
                }}
            />
        </ReactFlow>
    );
}