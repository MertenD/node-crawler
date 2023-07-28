import {NodeType} from "@/config/NodeType.ts";
import {OutputValueType} from "@/config/OutputValueType";

export const connectionRules: { [K in ConnectionRule] } = {
    [NodeType.START_NODE]: {
        outputValueType: OutputValueType.NONE,
        inputRules: []
    },
    [NodeType.FETCH_WEBSITE_NODE]: {
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
    [NodeType.SAVE_NODE]: {
        outputValueType: OutputValueType.NONE,
        inputRules: [
            {
                handleId: "input",
                allowedValueTypes: [
                    OutputValueType.HTML,
                    OutputValueType.TEXT,
                    OutputValueType.JSON
                ],
                maxConnections: 1
            }
        ]
    },
    [NodeType.EXTRACTOR_NODE]: {
        outputValueType: OutputValueType.JSON,
        inputRules: [
            {
                handleId: "input",
                allowedValueTypes: [
                    OutputValueType.HTML
                ],
                maxConnections: 1
            }
        ]
    },
    [NodeType.MERGE_NODE]: {
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
    }
}

export type ConnectionRule = {
    outputValueType: OutputValueType | null
    inputRules: InputRule[]
}

export type InputRule = {
    handleId: string
    allowedValueTypes: OutputValueType[]
    maxConnections: number
}
