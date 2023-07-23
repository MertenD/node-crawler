import {BasicNode} from "./BasicNode";
import {NodeTypes} from "@/model/NodeTypes";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {SaveNodeData} from "@/components/editor/pages/canvas/nodes/SaveNode";

export class EngineSaveNode implements BasicNode {
    id: string;
    nodeType: NodeTypes
    data: SaveNodeData

    constructor(id: string, data: SaveNodeData) {
        this.id = id
        this.nodeType = NodeTypes.SAVE_NODE
        this.data = data
    }

    async run() {

        const input = usePlayStore.getState().getInput(this.id, "input")

        if (input) {
            usePlayStore.getState().writeToLog(`Saving file as "${this.data.fileName}.${this.data.extension}"`)
            usePlayStore.getState().addFile(this.data.fileName, this.data.extension, input.join(this.data.separator))
            setTimeout(() => {  usePlayStore.getState().nextNode() }, 100);
        }
    }
}