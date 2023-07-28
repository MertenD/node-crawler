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

            usePlayStore.getState().addOutgoingPipelines(this.id, inputs)

            setTimeout(() => {  usePlayStore.getState().nextNode() }, 100);
        }
    }
}