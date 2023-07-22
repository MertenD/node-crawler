import {BasicNode} from "./BasicNode";
import {NodeTypes} from "@/model/NodeTypes";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {SaveNodeData} from "@/components/editor/pages/edit/nodes/SaveNode";

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

        usePlayStore.getState().writeToLog(`Saving file as "${this.data.fileName}"`)
        usePlayStore.getState().addFile(this.data.fileName, this.data.extension, input.join(", "))
        usePlayStore.getState().nextNode()
    }
}