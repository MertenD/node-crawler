import {BasicNode} from "@/engine/nodes/BasicNode";
import {NodeType} from "@/config/NodeType";
import {ExtractionMode, ExtractorNodeData} from "@/components/editor/pages/canvas/nodes/ExtractorNode";
import {usePlayStore} from "@/stores/editor/PlayStore";
import * as cheerio from 'cheerio';
import {HtmlOutput} from "@/config/OutputValueType";

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
        const inputs = usePlayStore.getState().getInput(this.id, "input") as HtmlOutput[] | undefined

        if (inputs) {

            usePlayStore.getState().writeToLog(`Extracting "${this.data.tag}" from provided html`)

            const elements = inputs.map(input => {
                const tag = this.data.tag;

                // Parse the HTML with Cheerio
                const $ = cheerio.load(input.value);

                const mapToHtmlOutput = (value: string, source_url: string): HtmlOutput => {
                    return {
                        metadata: {
                            source_url: source_url
                        },
                        value: value
                    } as HtmlOutput
                }

                switch (this.data.extractionMode) {
                    case ExtractionMode.ATTRIBUTE:

                        const extractAttribute = (el: cheerio.Element, attribute: string, baseOrigin: string): string | undefined => {
                            let value = $(el).attr(attribute)
                            if (attribute === "href" && value) {
                                return new URL(value, baseOrigin).href
                            }
                            return value
                        }

                        const attributeToExtract = this.data.attributeToExtract.toLowerCase()
                        const baseOrigin = new URL(input.metadata.source_url).origin

                        return $(tag).map((i, el) => {
                            return extractAttribute(el, attributeToExtract, baseOrigin)
                        }).get().filter(Boolean).map(value => {
                            return mapToHtmlOutput(value, input.metadata.source_url)
                        })
                    case ExtractionMode.CONTENT:
                    default:
                        return $(tag).map((i, el) => $(el).html()).get().map(el => {
                            return mapToHtmlOutput(el, input.metadata.source_url)
                        })
                }
            }).flat() as HtmlOutput[]

            usePlayStore.getState().writeToLog(`Extracted ${elements.length} elements`)

            // Here, 'elements' is an array that contains the inner HTML of each "tag" element

            usePlayStore.getState().addOutgoingPipelines(this.id, elements);

            // End with calling the next node
            setTimeout(() => {
                usePlayStore.getState().nextNode()
            }, 100);
        }
    }
}