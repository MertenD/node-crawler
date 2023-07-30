import {BasicNode} from "@/engine/nodes/BasicNode";
import {NodeType} from "@/config/NodeType";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {ZipNodeData} from "@/components/editor/pages/canvas/nodes/ZipNode";

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
        // TODO Hier vielleicht sinnvoll zusätzlich noch mitzugeben, welche OutputDataValue das ist, damit man im Fall hier Fallunterscheiden kann
        const inputs = usePlayStore.getState().getInput(this.id, "input", false)

        // TODO HTML To Text node

        if (inputs) {

            usePlayStore.getState().writeToLog(`Zipping ${inputs.length} inputs together`)

            const zippedInputs = inputs[0].map((_,i) => inputs.map(row => row[i])).map(zippedList => {
                return zippedList.reduce((acc, value, index) => {
                    acc[index.toString()] = value;
                    return acc;
                }, {});
            });

            usePlayStore.getState().addOutgoingPipelines(this.id, JSON.stringify(zippedInputs, null, 2));

            // End with calling the next node
            setTimeout(() => {  usePlayStore.getState().nextNode() }, 100);
        }
    }
}