import {BasicNode} from "@/engine/nodes/BasicNode";
import {NodeType} from "@/config/NodeType";
import {ExtractorNodeData} from "@/components/editor/pages/canvas/nodes/ExtractorNode";
import {usePlayStore} from "@/stores/editor/PlayStore";
import * as cheerio from 'cheerio';

export class EngineExtractorNode implements BasicNode {
    id: string;
    nodeType: NodeType
    data: ExtractorNodeData

    constructor(id: string, data: ExtractorNodeData) {
        this.id = id
        this.nodeType = NodeType.EXTRACTOR_NODE
        this.data = data
    }

    async run() {
        // TODO Hier vielleicht sinnvoll zusätzlich noch mitzugeben, welche OutputDataValue das ist, damit man im Fall hier Fallunterscheiden kann
        const inputs = usePlayStore.getState().getInput(this.id, "input") as string[]

        if (inputs) {

            usePlayStore.getState().writeToLog(`Extracting "${this.data.tag}" from provided html`)

            const elements = inputs.map(html => {
                const tag = this.data.tag;

                // Parse the HTML with Cheerio
                const $ = cheerio.load(html);

                // Extract all HTML elements that are inside a "tag"
                return $(tag).map((i, el) => $(el).html()).get()
            }).flat()

            usePlayStore.getState().writeToLog(`Extracted ${elements.length} elements`)

            // Here, 'elements' is an array that contains the inner HTML of each "tag" element

            usePlayStore.getState().addOutgoingPipelines(this.id, elements);

            // End with calling the next node
            setTimeout(() => {  usePlayStore.getState().nextNode() }, 100);
        }
    }
}