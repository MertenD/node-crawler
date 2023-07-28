import {MergeNodeData} from "@/components/editor/pages/canvas/nodes/MergeNode";
import {BasicNode} from "./BasicNode";
import {NodeType} from "@/config/NodeType";
import {usePlayStore} from "@/stores/editor/PlayStore";

export class EngineMergeNode implements BasicNode {
    id: string;
    nodeType: NodeType
    data: MergeNodeData

    constructor(id: string, data: MergeNodeData) {
        this.id = id
        this.nodeType = NodeType.MERGE_NODE
        this.data = data
    }

    async run() {
        const inputs = usePlayStore.getState().getInput(this.id, "input")

        if (inputs) {

            usePlayStore.getState().writeToLog(`Merging ${inputs.length} inputs together`)

            const flattenedInputs = inputs.map(input => {
                try {
                    return JSON.parse(input).flat()
                } catch(e) {
                    return input
                }
            }).flat()

            usePlayStore.getState().addOutgoingPipelines(this.id, JSON.stringify(flattenedInputs, null, 2))

            setTimeout(() => {  usePlayStore.getState().nextNode() }, 100);
        }
    }
}