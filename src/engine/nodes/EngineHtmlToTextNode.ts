import {BasicNode} from "@/engine/nodes/BasicNode";
import {NodeType} from "@/config/NodeType";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {HtmlToTextNodeData} from "@/components/editor/pages/canvas/nodes/HtmlToTextNode";
import {HtmlOutput, TextOutput} from "@/config/OutputValueType";
import cheerio from "cheerio";

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
        const inputs = usePlayStore.getState().getInput(this.id, "input") as HtmlOutput[] | undefined

        if (inputs) {

            usePlayStore.getState().writeToLog(`Turning ${inputs.length} HTML elements to text`)

            const cheerio = require('cheerio');
            const textElements: TextOutput[] = inputs.map(input => {
                return {
                    value: input.value.map(html => {
                        const $ = cheerio.load(html)
                        return $('body').text()
                    })
                } as TextOutput
            })

            usePlayStore.getState().addOutgoingPipelines(this.id, textElements);

            // End with calling the next node
            setTimeout(() => {  usePlayStore.getState().nextNode() }, 100);
        }
    }
}