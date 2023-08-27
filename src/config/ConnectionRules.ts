import {NodeType} from "@/config/NodeType";
import {OutputValueType} from "@/config/OutputValueType";
import useReactFlowStore from "@/stores/editor/ReactFlowStore";

export const connectionRules = new Map<NodeType, ConnectionRule | DynamicConnectionRule>([
    [NodeType.START_NODE, {
        outputValueType: OutputValueType.NONE,
        inputRules: []
    }],
    [NodeType.FETCH_WEBSITE_NODE, {
        outputValueType: OutputValueType.HTML,
        inputRules: [
            {
                handleId: "input",
                allowedValueTypes: [
                    OutputValueType.NONE,
                    OutputValueType.TEXT,
                    OutputValueType.HTML
                ],
                maxConnections: 999
            }
        ]
    }],
    [NodeType.SAVE_NODE, {
        outputValueType: OutputValueType.NONE,
        inputRules: [
            {
                handleId: "input",
                allowedValueTypes: [
                    OutputValueType.HTML,
                    OutputValueType.TEXT,
                    OutputValueType.JSON,
                    OutputValueType.DATABASE
                ],
                maxConnections: 999
            }
        ]
    }],
    [NodeType.EXTRACTOR_NODE, {
        outputValueType: OutputValueType.HTML,
        inputRules: [
            {
                handleId: "input",
                allowedValueTypes: [
                    OutputValueType.HTML
                ],
                maxConnections: 999
            }
        ]
    }],
    [NodeType.ZIP_NODE, {
        outputValueType: OutputValueType.JSON,
        inputRules: [
            {
                handleId: "input",
                allowedValueTypes: [
                    OutputValueType.HTML,
                    OutputValueType.TEXT,
                    OutputValueType.JSON
                ],
                maxConnections: 999
            }
        ]
    }],
    [NodeType.HTML_TO_TEXT_NODE, {
        outputValueType: OutputValueType.TEXT,
        inputRules: [
            {
                handleId: "input",
                allowedValueTypes: [
                    OutputValueType.HTML
                ],
                maxConnections: 999
            }
        ]
    }],
    [NodeType.DATABASE_TABLE_NODE, {}]
])

export type ConnectionRule = {
    outputValueType: OutputValueType | null
    inputRules: InputRule[]
}

export type DynamicConnectionRule = {
    [key: string]: ConnectionRule
}

export type InputRule = {
    handleId: string
    allowedValueTypes: OutputValueType[]
    maxConnections: number
}

export function addOrUpdateDynamicRule(nodeType: NodeType, nodeId: string, rule: ConnectionRule) {
    if (isDynamicNodeType(nodeType) && connectionRules.get(nodeType)) {
        (connectionRules.get(nodeType) as DynamicConnectionRule)[nodeId] = rule;
    }
    useReactFlowStore.getState().removeIllegalEdgesAfterDynamicNodeChange(nodeType, nodeId)
}

export function removeDynamicRule(nodeType: NodeType, key: string) {
    if (isDynamicNodeType(nodeType) && connectionRules.get(nodeType)) {
        delete (connectionRules.get(nodeType) as DynamicConnectionRule)[key];
    }
}

export function isDynamicNodeType(nodeType: NodeType): nodeType is NodeType {
    const rule = connectionRules.get(nodeType)
    return !(!!rule?.outputValueType);
}

export function getConnectionRule(nodeType: NodeType, nodeId: string): ConnectionRule | undefined {
    return isDynamicNodeType(nodeType) ?
        (connectionRules.get(nodeType) as DynamicConnectionRule)[nodeId] :
        connectionRules.get(nodeType) as ConnectionRule
}

export function getOutputValueType(nodeType: NodeType, nodeId: string): OutputValueType | null {
    const connectionRule = getConnectionRule(nodeType, nodeId)
    if (!connectionRule) {
        return null
    }
    return connectionRule.outputValueType
}

export function getAllowedValueTypes(nodeType: NodeType, nodeId: string, targetHandle: string | null): OutputValueType[] {
    const connectionRule = getConnectionRule(nodeType, nodeId)
    if (!connectionRule) {
        return []
    }
    return connectionRule.inputRules.find(rule => {
        return rule.handleId === targetHandle
    })?.allowedValueTypes || []
}

export function getMaxConnections(nodeType: NodeType, nodeId: string, targetHandle: string | null): number {
    const connectionRule = getConnectionRule(nodeType, nodeId)
    if (!connectionRule) {
        return 0
    }
    return connectionRule.inputRules.find(rule => {
        return rule.handleId === targetHandle
    })?.maxConnections || 0
}

export function getInputRules(nodeType: NodeType, nodeId: string): InputRule[] {
    const connectionRule = getConnectionRule(nodeType, nodeId)
    return connectionRule?.inputRules || []
}

export function isConnectionAllowed(pipelineValueType: OutputValueType | null, targetNodeType: NodeType, targetNodeId: string, targetHandle: string | null): boolean {
    const connectionRule = getConnectionRule(targetNodeType, targetNodeId)

    return !!pipelineValueType && !!connectionRule?.inputRules.find(rule => {
        return rule.handleId === targetHandle
    })?.allowedValueTypes?.includes(pipelineValueType)
}
