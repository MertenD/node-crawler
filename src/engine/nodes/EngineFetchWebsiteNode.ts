import {BasicNode} from "./BasicNode";
import {NodeTypes} from "@/model/NodeTypes";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {FetchWebsiteNodeData} from "@/components/editor/pages/edit/nodes/FetchWebsiteNode";

export class EngineFetchWebsiteNode implements BasicNode {
    id: string;
    nodeType: NodeTypes
    data: FetchWebsiteNodeData

    constructor(id: string, data: FetchWebsiteNodeData) {
        this.id = id
        this.nodeType = NodeTypes.FETCH_WEBSITE_NODE
        this.data = data
    }

    run(): void {
        console.log("Fetch Website", this.data.name, this.data.url)
        usePlayStore.getState().nextNode()
    }
}