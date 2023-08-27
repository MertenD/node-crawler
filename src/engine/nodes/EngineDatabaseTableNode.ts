import {BasicNode} from "@/engine/nodes/BasicNode";
import {NodeType} from "@/config/NodeType";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {DatabaseTableNodeData} from "@/components/editor/pages/canvas/nodes/DatabaseTableNode";

export class EngineDatabaseTableNode implements BasicNode {
    id: string;
    nodeType: NodeType
    data: DatabaseTableNodeData

    constructor(id: string, data: DatabaseTableNodeData) {
        this.id = id
        this.nodeType = NodeType.DATABASE_TABLE_NODE
        this.data = data
    }

    async run() {

        setTimeout(() => {
            usePlayStore.getState().nextNode()
        }, 2000);
    }
}