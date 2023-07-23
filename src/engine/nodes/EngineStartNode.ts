import {BasicNode} from "./BasicNode";
import {NodeTypes} from "@/model/NodeTypes";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {StartNodeData} from "@/components/editor/pages/canvas/nodes/StartNode";

export class EngineStartNode implements BasicNode {
    id: string;
    nodeType: NodeTypes
    data: StartNodeData

    constructor(id: string) {
        this.id = id
        this.nodeType = NodeTypes.START_NODE
        this.data = {}
    }

    async run() {
        usePlayStore.getState().writeToLog("Starting crawler")
        setTimeout(() => {  usePlayStore.getState().nextNode() }, 200);
    }
}