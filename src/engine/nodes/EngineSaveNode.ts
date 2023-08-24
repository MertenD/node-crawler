import {BasicNode} from "./BasicNode";
import {NodeType} from "@/config/NodeType";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {SaveNodeData} from "@/components/editor/pages/canvas/nodes/SaveNode";
import {HtmlOutput, JsonOutput, TextOutput} from "@/config/OutputValueType";

export class EngineSaveNode implements BasicNode {
    id: string;
    nodeType: NodeType
    data: SaveNodeData

    constructor(id: string, data: SaveNodeData) {
        this.id = id
        this.nodeType = NodeType.SAVE_NODE
        this.data = data
    }

    async run() {

        const inputs = usePlayStore.getState().getInput(this.id, "input") as (HtmlOutput | TextOutput | JsonOutput)[] | undefined

        if (inputs) {
            usePlayStore.getState().writeToLog(`Saving file as "${this.data.fileName}.${this.data.extension}"`)
            console.log("Inputs", inputs)
            usePlayStore.getState().addFile(this.data.fileName, this.data.extension, inputs.map(input => {
                if (typeof input.value === "object") {
                    return JSON.stringify(input.value, null, 2)
                }
                return input.value
            }).join(this.data.separator))
            setTimeout(() => {  usePlayStore.getState().nextNode() }, 100);
        }
    }
}