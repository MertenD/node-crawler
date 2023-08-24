import {BasicNode} from "./BasicNode";
import {NodeType} from "@/config/NodeType";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {FetchWebsiteNodeData} from "@/components/editor/pages/canvas/nodes/FetchWebsiteNode";
import {HtmlOutput, NoneOutput, TextOutput} from "@/config/OutputValueType";

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

        const inputs = usePlayStore.getState().getInput(this.id, "input") as TextOutput[] | HtmlOutput[] | NoneOutput[] | undefined

        const combinedUrls: string[] = [...this.data.urls ?? [], ...inputs?.map(input => input.value.toString()) ?? []]

        usePlayStore.getState().writeToLog(`Fetching ${combinedUrls.length} websites with name "${this.data.name}"`)

        let fetchResults: HtmlOutput[] = []

        for (const url of combinedUrls) {

            const index = combinedUrls.indexOf(url);

            usePlayStore.getState().writeToLog(`Fetching website "${url}" (${index + 1} of ${combinedUrls.length})`)

            await fetch('/api/fetch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Response code was: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                fetchResults.push({
                    metadata: {
                        source_url: url,
                    },
                    value: data
                });
                usePlayStore.getState().writeToLog(`Website content (First 500 characters): ${data.substring(0, 499)}`);
            })
            .catch(error => {
                usePlayStore.getState().writeToLog(`Error while fetching website. Error was: ${error}`);
            });
        }

        usePlayStore.getState().addOutgoingPipelines(this.id, fetchResults)
        usePlayStore.getState().nextNode();
    }
}