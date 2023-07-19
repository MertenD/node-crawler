import {BasicNode} from "./BasicNode";
import {NodeTypes} from "@/model/NodeTypes";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {StartNodeData} from "@/components/editor/pages/edit/nodes/StartNode";

export class EngineStartNode implements BasicNode {
    id: string;
    nodeType: NodeTypes
    data: StartNodeData

    constructor(id: string) {
        this.id = id
        this.nodeType = NodeTypes.START_NODE
        this.data = {}
    }

    run(): void {
        usePlayStore.getState().writeToLog("Starting crawler")
        usePlayStore.getState().nextNode()
    }
}