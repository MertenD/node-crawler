import {BasicNode} from "./BasicNode";
import {NodeType} from "@/config/NodeType";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {FetchWebsiteNodeData} from "@/components/editor/pages/canvas/nodes/FetchWebsiteNode";

export class EngineFetchWebsiteNode implements BasicNode {
    id: string;
    nodeType: NodeType
    data: FetchWebsiteNodeData

    constructor(id: string, data: FetchWebsiteNodeData) {
        this.id = id
        this.nodeType = NodeType.FETCH_WEBSITE_NODE
        this.data = data
    }

    async run() {
        usePlayStore.getState().writeToLog(`Fetching website "${this.data.url}" with name "${this.data.name}"`)

        await fetch('/api/fetch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: this.data.url })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Response code was: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                usePlayStore.getState().addOutgoingPipelines(this.id, data)
                usePlayStore.getState().writeToLog(`Website content (First 500 characters): ${data.substring(0, 499)}`);
                usePlayStore.getState().nextNode();
            })
            .catch(error => {
                usePlayStore.getState().writeToLog(`Error while fetching website. Error was: ${error}`);
                usePlayStore.getState().stop();
            });
    }
}