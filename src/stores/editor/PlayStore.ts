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
    log: []
    setup: () => void
    stop: () => void
    getFirstNode: () => NodeMapValue | null
    setCurrentNode: (newNode: NodeMapValue | null) => void
    nextNode: (nextNodeKey?: NextNodeKey) => void
    getVariable: (name: string) => any
    setVariable: (name: string, value: any) => void
    writeToLog: (message: string) => void
}

export const usePlayStore = create<PlayStoreState>((set, get) => ({
    nodeMap: new Map(),
    currentNode: null,
    variables: {},
    log: [],
    setup: () => {
        // reset store
        set({
            nodeMap: new Map(),
            currentNode: null,
            variables: null,
            log: []
        })
        get().writeToLog("Setting up crawler")
        // set new store
        set({
            nodeMap: getNodeMap(useReactFlowStore.getState().nodes, useReactFlowStore.getState().edges)
        })
        get().setCurrentNode(get().getFirstNode())
    },
    stop: () => {
        set({
            nodeMap: new Map(),
            currentNode: null,
            variables: null,
            log: []
        })
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
            get().setCurrentNode(null)
            return
        }

        const nextNode = get().currentNode?.next
        if (nextNode !== null && nextNode !== undefined) {
            const newNode = get().nodeMap.get(nextNode[nextNodeKey])
            if (newNode) {
                get().setCurrentNode(newNode)
            } else {
                get().setCurrentNode(null)
            }
        } else {
            get().setCurrentNode(null)
        }
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
    writeToLog: (message: string) => {
        set({
            log: [...get().log, `${getFormattedTimestamp()}: ${message}`]
        })
    }
}))