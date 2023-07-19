import create from 'zustand';
import {NodeMap, NodeMapValue} from "@/model/NodeMap";
import {NextNodeKey} from "@/model/NextNodeKey";
import {NodeTypes} from "@/model/NodeTypes";
import {getNodeMap} from "@/util/NodeMapTransformer";
import useReactFlowStore from "@/stores/editor/ReactFlowStore";

export type PlayStoreState = {
    nodeMap: NodeMap
    currentNode: NodeMapValue | null
    variables: Record<string, any>
    setup: () => void
    getFirstNode: () => NodeMapValue | null
    setCurrentNode: (newNode: NodeMapValue | null) => void
    nextNode: (nextNodeKey?: NextNodeKey) => void
    getVariable: (name: string) => any
    setVariable: (name: string, value: any) => void
}

export const usePlayStore = create<PlayStoreState>((set, get) => ({
    nodeMap: new Map(),
    currentNode: null,
    variables: {},
    setup: () => {
        // reset store
        set({
            nodeMap: new Map(),
            currentNode: null,
            variables: null
        })
        // set new store
        set({
            nodeMap: getNodeMap(useReactFlowStore.getState().nodes, useReactFlowStore.getState().edges)
        })
        get().setCurrentNode(get().getFirstNode())
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
            return
        }

        const nextNode = get().currentNode?.next
        if (nextNode !== null && nextNode !== undefined) {
            const newNode = get().nodeMap.get(nextNode[nextNodeKey])
            if (newNode) {
                get().setCurrentNode(newNode)
            }
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
}))