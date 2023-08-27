import create from 'zustand';
import {NodeMap, NodeMapValue} from "@/model/NodeMap";
import {NextNodeKey} from "@/model/NextNodeKey";
import {NodeType} from "@/config/NodeType";
import {getNodeMap} from "@/util/NodeMapTransformer";
import useReactFlowStore from "@/stores/editor/ReactFlowStore";
import {Output, OutputValueType} from "@/config/OutputValueType";
import {getConnectionRule} from "@/config/ConnectionRules";

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

type Pipeline = {
    from: string;
    to: string | null;
    toHandleId: string | null;
    value: Output[] | null;
    isActivated: boolean;
};

export type PlayStoreState = {
    nodeMap: NodeMap
    currentNode: NodeMapValue | null
    variables: Record<string, any>
    files: {name: string, extension: string, content: string}[]
    log: string[]
    pipelines: Pipeline[]
    isProcessRunning: boolean
    isStepByStep: boolean
    isNextStepReady: boolean,
    stepByStepNextNodeKeyCache: NextNodeKey,
    setup: () => void
    stop: () => void
    setIsStepByStep: (isStepByStep: boolean) => void
    getFirstNode: () => NodeMapValue | null
    setCurrentNode: (newNode: NodeMapValue | null) => void
    nextNode: (nextNodeKey?: NextNodeKey, executeNextStep?: boolean) => void
    executeNextStep: () => void
    backtrackToNextPossibleNode: () => void
    getNode: (nodeId: string) => NodeMapValue | null
    getVariable: (name: string) => any
    setVariable: (name: string, value: any) => void
    addFile: (name: string, extension: string, content: string) => void
    writeToLog: (message: string) => void
    addOutgoingPipelines: (from: string, value?: Output[] | Output | null) => void
    deactivateIngoingPipelines: (to: string) => void
    getInput: (nodeId: string, handleId: string, flattenInput?: boolean) => Output[][] | Output[] | undefined
    getInputForAllHandles: (nodeId: string, flattenInput?: boolean) => Record<string, Output[][] | Output[]> | undefined
}

export const usePlayStore = create<PlayStoreState>((set, get) => ({
    nodeMap: new Map(),
    currentNode: null,
    variables: {},
    files: [],
    log: [],
    pipelines: [],
    isProcessRunning: false,
    isStepByStep: false,
    isNextStepReady: false,
    stepByStepNextNodeKeyCache: NextNodeKey.ALWAYS,
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
                isProcessRunning: false,
                isStepByStep: false,
                isNextStepReady: false
            })
            useReactFlowStore.getState().setNodeSelected(null)
        }
    },
    setIsStepByStep: (isStepByStep: boolean) => {
        set({
            isStepByStep: isStepByStep
        })
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
    nextNode: (nextNodeKey: NextNodeKey = NextNodeKey.ALWAYS, executeNextStep: boolean = false) => {
        if (!executeNextStep && get().isStepByStep) {
            set({
                stepByStepNextNodeKeyCache: nextNodeKey,
                isNextStepReady: true
            })
            get().writeToLog("Step by step is activated. Waiting for next step...")
            return
        }

        if (!get().currentNode || get().currentNode?.next === null) {
            get().backtrackToNextPossibleNode()
            return
        }

        // Deactivate ingoing pipelines from current node before going to the next one
        get().deactivateIngoingPipelines(get().currentNode?.node.id || "")

        // Adding empty outgoing pipeline if there is none already
        const currentNodeId = get().currentNode?.node.id
        if (currentNodeId && !get().pipelines.find(pipeline => pipeline.from === currentNodeId)) {
            get().addOutgoingPipelines(currentNodeId)
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
    executeNextStep: () => {
        const cache = get().stepByStepNextNodeKeyCache
        set({
            stepByStepNextNodeKeyCache: NextNodeKey.ALWAYS,
            isNextStepReady: false
        })
        get().nextNode(cache, true)
    },
    backtrackToNextPossibleNode: () => {
        const nextNodeId = get().pipelines.find(pipeline =>
            pipeline.isActivated &&
            pipeline.to !== get().currentNode?.node.id
        )?.to
        if (nextNodeId) {
            get().writeToLog(`Going back to last node with all inputs available, which is a "${get().getNode(nextNodeId)?.node.nodeType}"`)
            get().setCurrentNode(get().getNode(nextNodeId))
        } else {
            get().writeToLog("There are no more nodes left")
            get().stop()
        }
    },
    getNode: (nodeId: string): NodeMapValue | null => {
        return get().nodeMap.get(nodeId) || null
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
    addOutgoingPipelines: (from: string, value: Output[] | Output | null = null) => {
        const next = Object.values(get().getNode(from)?.next || {}).flat()
        if (next.length > 0) {
            set({
                pipelines: [...get().pipelines, next.map(to => {
                    return {
                        from: from,
                        to: to.nodeId,
                        toHandleId: to.targetHandleId,
                        value: value === null ? value : (Array.isArray(value) ? value.flat() : [value]),
                        isActivated: true
                    }
                })].flat()
            })
        } else {
            set({
                pipelines: [...get().pipelines, {
                    from: from,
                    to: null,
                    toHandleId: null,
                    value: value === null ? value : (Array.isArray(value) ? value.flat() : [value]),
                    isActivated: false
                }]
            })
        }
    },
    deactivateIngoingPipelines: (to: string) => {
        set({
            pipelines: get().pipelines.map(pipeline => {
                if (pipeline.to === to) {
                    pipeline.isActivated = false
                }
                return pipeline
            })
        })
    },
    getInput: (nodeId: string, handleId: string, flattenInput: boolean = true): Output[][] | Output[] | undefined => {
        // Get input values from the pipelines of the targetHandle
        const inputs: Output[][] =  get().pipelines.filter(pipeline => {
            return pipeline.to === nodeId && pipeline.toHandleId === handleId && pipeline.value !== null
        }).map(pipeline => pipeline.value!)

        // Get amount of connected pipelines to the targetHandle
        const ingoingConnections = Array.from(get().nodeMap.values()).filter((value: NodeMapValue) => {
            if (value.next !== null) {
                return Object.values(value.next).some(nextValue =>
                    nextValue.map(n => n.nodeId).includes(nodeId) &&
                    nextValue.map(n => n.targetHandleId).includes(handleId)
                );
            }
            return false;
        }).length;

        let amountOfPrevNoneOutputValues = 0;
        // Traverse the nodeMap to find the previous nodes for the given nodeId
        // and count how many of them have an output value of NONE
        get().nodeMap.forEach((value) => {
            if (value.next) {
                Object.values(value.next).forEach(arr => {
                    arr.forEach(connection => {
                        if (connection.nodeId === nodeId) {
                            const prevNode = value.node;
                            const rule = getConnectionRule(prevNode.nodeType, prevNode.id)
                            if (rule && rule.outputValueType === OutputValueType.NONE) {
                                amountOfPrevNoneOutputValues++;
                            }
                        }
                    });
                });
            }
        });

        // If the input array contains exactly the required amount of inputs and if none of those inputs are undefined
        // Then everything is okay and the value will be returned
        if (inputs.length === ingoingConnections - amountOfPrevNoneOutputValues && inputs.every(value => value !== undefined)) {
            if (flattenInput) {
                return inputs.flat()
            } else {
                return inputs
            }
        } else {

            // If any input value is missing or is undefined the crawler will backtrack to the next node that
            // has all input values available

            get().writeToLog(`One ore more inputs of the current node "${get().getNode(nodeId)?.node.nodeType}" are undefined`)
            get().backtrackToNextPossibleNode()
            return undefined
        }
    },
    getInputForAllHandles: (nodeId: string, flattenInput: boolean = true): Record<string, Output[][] | Output[]> | undefined => {
        const handleIds = Array.from(new Set(useReactFlowStore.getState().edges
            .filter(edge => edge.target === nodeId)
            .map(edge => {
                return edge.targetHandle
            })
            .filter(handleId => handleId)
        )) as string[]

        const inputs: Record<string, Output[][] | Output[]> = {};
        let allInputsDefined = true;

        for (const handleId of handleIds) {
            const input = get().getInput(nodeId, handleId, flattenInput);
            if (input) {
                inputs[handleId] = input;
            } else {
                allInputsDefined = false;
                break;
            }
        }

        if (!allInputsDefined) {
            return undefined;
        }

        return inputs
    }
}))