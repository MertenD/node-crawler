import create from 'zustand';
import {NodeMap, NodeMapValue} from "@/model/NodeMap";
import {NextNodeKey} from "@/model/NextNodeKey";
import {NodeTypes} from "@/model/NodeTypes";
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
    files: {name: string, content: string}[]
    log: string[]
    pipelines: {from: string, to: string, value: any}[]
    isProcessRunning: boolean
    setup: () => void
    stop: () => void
    getFirstNode: () => NodeMapValue | null
    setCurrentNode: (newNode: NodeMapValue | null) => void
    nextNode: (nextNodeKey?: NextNodeKey) => void
    getNode: (nodeId: string) => void
    getVariable: (name: string) => any
    setVariable: (name: string, value: any) => void
    addFile: (name: string, extension: string, content: string) => void
    writeToLog: (message: string) => void
    addPipeline: (from: string, value: any) => void
    getInput: (nodeId: string) => string[]
    setIsProcessRunning: (newValue: boolean) => void
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
            variables: null,
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
            get().setCurrentNode(get().getFirstNode())
        } else {
            get().writeToLog("Error: There is no start node")
            get().stop()
        }
    },
    stop: () => {
        if (get().isProcessRunning) {
            get().writeToLog("Crawler stopped successfully")
            set({
                nodeMap: new Map(),
                currentNode: null,
                isProcessRunning: false
            })
        }
    },
    setCurrentNode: (newNode: NodeMapValue | null) => {
        set({
            currentNode: newNode
        })
    },
    getFirstNode: (): NodeMapValue | null => {
        const firstNode = Array.from(get().nodeMap.values()).find(({node}) =>
            node.nodeType === NodeTypes.START_NODE
        );
        return firstNode as NodeMapValue || null
    },
    nextNode: (nextNodeKey: NextNodeKey = NextNodeKey.ONLY) => {
        if (!get().currentNode || get().currentNode?.next === null) {
            get().stop()
            return
        }

        const nextNode = get().currentNode?.next
        if (nextNode !== null && nextNode !== undefined) {
            const newNode = get().nodeMap.get(nextNode[nextNodeKey])
            if (newNode) {
                get().setCurrentNode(newNode)
            } else {
                get().stop()
            }
        } else {
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
    addPipeline: (from: string, value: any) => {
        set({
            pipelines: [...get().outputsToInputs, Object.values(get().getNode(from).next).map(to => {
                return {
                    from: from,
                    to: to,
                    value: value
                }
            })].flat()
        })
    },
    getInput: (nodeId: string): string[] => {
        return get().outputsToInputs.filter(outputToInput => {
            return outputToInput.to === nodeId
        }).map(outputToInput => outputToInput.value)
    }
}))