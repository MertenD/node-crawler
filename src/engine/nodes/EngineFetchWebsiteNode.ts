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
        usePlayStore.getState().writeToLog(`Fetching website "${this.data.url} with name ${this.data.name}`)

        fetch('/api/fetch', {
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
                usePlayStore.getState().writeToLog(`Website content (First 1000 characters): ${data.substring(0, 999)}`);
                usePlayStore.getState().nextNode();
            })
            .catch(error => {
                usePlayStore.getState().writeToLog(`Error while fetching website. Error was: ${error}`);
                usePlayStore.getState().stop();
            });
    }
}