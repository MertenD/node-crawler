import {NodeTypes} from "@/model/NodeTypes";

export enum OutputValueType {
    NONE = "none",
    HTML = "html",
    JSON = "json",
    TEXT = "text"
}

export const connectionRules: ConnectionRule[] = [
    {
        nodeType: NodeTypes.START_NODE,
        outputValueType: OutputValueType.NONE,
        inputRules: []
    },
    {
        nodeType: NodeTypes.FETCH_WEBSITE_NODE,
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
        nodeType: NodeTypes.SAVE_NODE,
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
    nodeType: NodeTypes
    outputValueType: OutputValueType
    inputRules: InputRule[]
}

export type InputRule = {
    handleId: string
    allowedValueTypes: OutputValueType[]
    maxConnections: number
}