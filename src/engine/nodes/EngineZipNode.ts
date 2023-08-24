import {BasicNode} from "@/engine/nodes/BasicNode";
import {NodeType} from "@/config/NodeType";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {ZipNodeData} from "@/components/editor/pages/canvas/nodes/ZipNode";
import {HtmlOutput, JsonOutput, TextOutput} from "@/config/OutputValueType";
import {HtmlOutlined} from "@mui/icons-material";

export class EngineZipNode implements BasicNode {
    id: string;
    nodeType: NodeType
    data: ZipNodeData

    constructor(id: string, data: ZipNodeData) {
        this.id = id
        this.nodeType = NodeType.ZIP_NODE
        this.data = data
    }

    async run() {
        const inputs = usePlayStore.getState().getInput(this.id, "input", false) as (HtmlOutput | TextOutput | JsonOutput)[][] | undefined

        if (inputs) {

            usePlayStore.getState().writeToLog(`Zipping ${inputs.length} inputs together`)

            const zippedInputs = inputs[0].map((_, i) => inputs.map(row => row[i]))
                .map(zippedList => {
                    const jsonObject = zippedList.reduce((acc, value, index) => {
                        acc[index.toString()] = value.value;
                        return acc;
                    }, {} as Record<string, any>);

                    return {
                        value: jsonObject
                    };
                }) as JsonOutput[]

            usePlayStore.getState().addOutgoingPipelines(this.id, zippedInputs);

            // End with calling the next node
            setTimeout(() => {  usePlayStore.getState().nextNode() }, 100);
        }
    }
}