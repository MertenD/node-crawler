import {BasicNode} from "./BasicNode";
import {NodeType} from "@/config/NodeType";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {StartNodeData} from "@/components/editor/pages/canvas/nodes/StartNode";

export class EngineStartNode implements BasicNode {
    id: string;
    nodeType: NodeType
    data: StartNodeData

    constructor(id: string, data: StartNodeData) {
        this.id = id
        this.nodeType = NodeType.START_NODE
        this.data = data
    }

    async run() {
        usePlayStore.getState().writeToLog("Starting crawler")
        setTimeout(() => {  usePlayStore.getState().nextNode() }, 200);
    }
}