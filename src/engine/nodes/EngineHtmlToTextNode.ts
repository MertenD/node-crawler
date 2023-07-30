import {BasicNode} from "@/engine/nodes/BasicNode";
import {NodeType} from "@/config/NodeType";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {HtmlToTextNodeData} from "@/components/editor/pages/canvas/nodes/HtmlToTextNode";

export class EngineHtmlToTextNode implements BasicNode {
    id: string;
    nodeType: NodeType
    data: HtmlToTextNodeData

    constructor(id: string, data: HtmlToTextNodeData) {
        this.id = id
        this.nodeType = NodeType.HTML_TO_TEXT_NODE
        this.data = data
    }

    async run() {
        // TODO Hier vielleicht sinnvoll zusätzlich noch mitzugeben, welche OutputDataValue das ist, damit man im Fall hier Fallunterscheiden kann
        const inputs = usePlayStore.getState().getInput(this.id, "input")

        if (inputs) {

            usePlayStore.getState().writeToLog(`Turning ${inputs.length} HTML elements to text`)

            const cheerio = require('cheerio');
            const textElements: string[] = inputs.map(input => {
                const $ = cheerio.load(input);
                return $('body').text()
            })

            usePlayStore.getState().addOutgoingPipelines(this.id, textElements);

            // End with calling the next node
            setTimeout(() => {  usePlayStore.getState().nextNode() }, 100);
        }
    }
}