import {NodeType} from "@/config/NodeType.ts";
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
                // TODO Hier noch sowas wie, "warten auf alle" oder "jedes einzeln" und dementsprechend auch die Logik anpassen
                // TODO OOOOOder Alles ist immer automatisch "jedes einzeln" bearbeiten und um verschiedene Pipelines zu verbinden, gibt es einen Connector Node (Find ich besser)
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
                maxConnections: 1
            }
        ]
    },
    {
        nodeType: NodeType.EXTRACTOR_NODE,
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
    {
        nodeType: NodeType.MERGE_NODE,
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
] as ConnectionRule[]

export type ConnectionRule = {
    nodeType: NodeType
    outputValueType: OutputValueType | null
    inputRules: InputRule[]
}

export type InputRule = {
    handleId: string
    allowedValueTypes: OutputValueType[]
    maxConnections: number
}