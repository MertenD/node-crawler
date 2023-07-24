import create from 'zustand';
import {NodeMap, NodeMapValue} from "@/model/NodeMap";
import {NextNodeKey} from "@/model/NextNodeKey";
import {NodeType} from "@/config/NodeType";
import {getNodeMap} from "@/util/NodeMapTransformer";
import useReactFlowStore from "@/stores/editor/ReactFlowStore";

function getFormattedTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');  // JavaScript months are 0-based.
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export type PlayStoreState = {
    nodeMap: NodeMap
    currentNode: NodeMapValue | null
    variables: Record<string, any>
    files: {name: string, extension: string, content: string}[]
    log: string[]
    pipelines: {from: string, to: string, toHandleId: string, value: any}[]
    isProcessRunning: boolean
    setup: () => void
    stop: () => void
    getFirstNode: () => NodeMapValue | null
    setCurrentNode: (newNode: NodeMapValue | null) => void
    nextNode: (nextNodeKey?: NextNodeKey) => void
    backtrackToNextPossibleNode: () => void
    getNode: (nodeId: string) => void
    getVariable: (name: string) => any
    setVariable: (name: string, value: any) => void
    addFile: (name: string, extension: string, content: string) => void
    writeToLog: (message: string) => void
    addOutgoingPipelines: (from: string, value: any) => void
    removeIngoingPipelines: (to: string) => void
    getInput: (nodeId: string, handleId: string) => string[] | undefined
}

export const usePlayStore = create<PlayStoreState>((set, get) => ({
    nodeMap: new Map(),
    currentNode: null,
    variables: {},
    files: [],
    log: [],
    pipelines: [],
    isProcessRunning: false,
    setup: () => {
        // reset store
        set({
            nodeMap: new Map(),
            currentNode: null,
            variables: {},
            files: [],
            log: [],
            pipelines: [],
            isProcessRunning: false
        })
        get().writeToLog("Setting up crawler")
        // set new store
        set({
            nodeMap: getNodeMap(useReactFlowStore.getState().nodes, useReactFlowStore.getState().edges),
            isProcessRunning: true
        })

        const firstNode = get().getFirstNode()
        if (firstNode !== null) {
            get().setCurrentNode(firstNode)
        } else {
            get().writeToLog("Error: There is no start node")
            get().stop()
        }
    },
    stop: () => {
        if (get().isProcessRunning) {
            get().writeToLog('Crawler stopped. You can see the created outputs in the "Output"-tab')
            set({
                nodeMap: new Map(),
                currentNode: null,
                isProcessRunning: false
            })
            useReactFlowStore.getState().setNodeSelected(null)
        }
    },
    setCurrentNode: (newNode: NodeMapValue | null) => {
        set({
            currentNode: newNode
        })
        if (newNode !== null) {
            useReactFlowStore.getState().setNodeSelected(newNode.node.id)
        }
    },
    getFirstNode: (): NodeMapValue | null => {
        const firstNode = Array.from(get().nodeMap.values()).find(({node}) =>
            node.nodeType === NodeType.START_NODE
        );
        return firstNode as NodeMapValue || null
    },
    nextNode: (nextNodeKey: NextNodeKey = NextNodeKey.ALWAYS) => {
        if (!get().currentNode || get().currentNode?.next === null) {
            get().backtrackToNextPossibleNode()
            return
        }

        // Remove ingoing pipelines from current node before going to the next one
        get().removeIngoingPipelines(get().currentNode.node.id)
        // Adding empty outgoing pipeline if there is none already
        if (!get().pipelines.find(pipeline => pipeline.from === get().currentNode.node.id)) {
            get().addOutgoingPipelines(get().currentNode.node.id)
        }

        const nextNode = get().currentNode?.next
        if (nextNode !== null && nextNode && nextNode[nextNodeKey] && nextNode[nextNodeKey][0]) {
            const newNode = get().nodeMap.get(nextNode[nextNodeKey][0].nodeId)
            if (newNode) {
                get().setCurrentNode(newNode)
            } else {
                get().backtrackToNextPossibleNode()
            }
        } else {
            get().backtrackToNextPossibleNode()
        }
    },
    backtrackToNextPossibleNode: () => {
        const nextNodeId = get().pipelines.find(pipeline =>
            pipeline.to !== get().currentNode.node.id
        )?.to
        if (nextNodeId) {

            get().writeToLog(`Going back to last node with all inputs available, which is a "${get().getNode(nextNodeId).node.nodeType}"`)
            get().setCurrentNode(get().getNode(nextNodeId))
        } else {
            get().writeToLog("There are no more nodes left")
            get().stop()
        }
    },
    getNode: (nodeId: string): NodeMapValue => {
        return get().nodeMap.get(nodeId)
    },
    getVariable: (name: string) => {
        return get().variables[name]
    },
    setVariable: (name: string, value: any) => {
        const oldVariables = get().variables
        const newVariables = {
            ...oldVariables,
            [name]: value
        }
        set({
            variables: newVariables
        })
    },
    addFile: (name: string, extension: string, content: string) => {
        set({
            files: [...get().files, {
                name: name,
                extension: extension,
                content: content
            }]
        })
    },
    writeToLog: (message: string) => {
        set({
            log: [...get().log, `${getFormattedTimestamp()}: ${message}`]
        })
    },
    addOutgoingPipelines: (from: string, value: any = null) => {
        set({
            pipelines: [...get().pipelines, Object.values(get().getNode(from).next).flat().map(to => {
                return {
                    from: from,
                    to: to.nodeId,
                    toHandleId: to.targetHandleId,
                    value: value
                }
            })].flat()
        })
    },
    removeIngoingPipelines: (to: string) => {
        set({
            pipelines: get().pipelines.filter(pipeline =>
                pipeline.to !== to
            )
        })
    },
    getInput: (nodeId: string, handleId: string): string[] | undefined => {
        // Get input values from the pipelines of the targetHandle
        const input =  get().pipelines.filter(pipeline => {
            return pipeline.to === nodeId && pipeline.toHandleId === handleId
        }).map(pipeline => pipeline.value)

        // Get amount of connected pipelines to the targetHandle
        const ingoingConnections = Array.from(get().nodeMap.values()).filter((value: NodeMapValue) => {
            if (value.next !== null) {
                return Object.values(value.next).some(nextValue => nextValue.map(n => n.nodeId).includes(nodeId));
            }
            return false;
        }).length;

        // If the input array contains exactly the required amount of inputs and if none of those inputs are undefined
        // Then everything is okay and the value will be returned
        if (input.length === ingoingConnections && input.every(value => value !== undefined)) {
            return input
        } else {

            // If any input value is missing or is undefined the crawler will backtrack to the next node that
            // has all input values available

            get().writeToLog(`One ore more inputs of the current node "${get().getNode(nodeId).node.nodeType}" are undefined`)
            get().backtrackToNextPossibleNode()
            return undefined
        }
    }
}))