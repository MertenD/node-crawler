import {NodeType} from "@/config/NodeType";
import {OutputValueType} from "@/config/OutputValueType";

export const connectionRules: ConnectionRule[] = [
    {
        nodeType: NodeType.START_NODE,
        outputValueType: OutputValueType.NONE,
        inputRules: []
    },
    {
        nodeType: NodeType.FETCH_WEBSITE_NODE,
        outputValueType: OutputValueType.HTML,
        inputRules: [
            {
                handleId: "input",
                allowedValueTypes: [
                    OutputValueType.NONE
                ],
                maxConnections: 1
            }
        ]
    },
    {
        nodeType: NodeType.SAVE_NODE,
        outputValueType: OutputValueType.NONE,
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
    }
] as ConnectionRule[]

export type ConnectionRule = {
    nodeType: NodeType
    outputValueType: OutputValueType
    inputRules: InputRule[]
}

export type InputRule = {
    handleId: string
    allowedValueTypes: OutputValueType[]
    maxConnections: number
}