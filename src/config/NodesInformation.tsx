import {NodeType} from "@/config/NodeType";
import React, {CSSProperties} from "react";
import {StartNode, StartOptions, startShapeStyle} from "@/components/editor/pages/canvas/nodes/StartNode";
import {
    FetchWebsiteNode,
    FetchWebsiteOptions,
    fetchWebsiteShapeStyle
} from "@/components/editor/pages/canvas/nodes/FetchWebsiteNode";
import {SaveNode, SaveOptions, saveShapeStyle,} from "@/components/editor/pages/canvas/nodes/SaveNode";
import {
    ExtractorNode,
    ExtractorOptions,
    extractorShapeStyle
} from "@/components/editor/pages/canvas/nodes/ExtractorNode";

export default function getNodesInformation(
    nodeId: string = ""
): {type: NodeType, node: React.ReactNode, title: string, options: React.ReactNode, style: CSSProperties}[] {

    return [
        {
            type: NodeType.START_NODE,
            title: "Start",
            node: StartNode,
            options: <StartOptions id={nodeId} />,
            style: startShapeStyle(true)
        },
        {
            type: NodeType.FETCH_WEBSITE_NODE,
            title: "Fetch Website",
            node: FetchWebsiteNode,
            options: <FetchWebsiteOptions id={nodeId}/>,
            style: fetchWebsiteShapeStyle(true)
        },
        {
            type: NodeType.SAVE_NODE,
            title: "Save",
            node: SaveNode,
            options: <SaveOptions id={nodeId} />,
            style: saveShapeStyle(true)
        },
        {
            type: NodeType.EXTRACTOR_NODE,
            title: "Extractor",
            node: ExtractorNode,
            options: <ExtractorOptions id={nodeId} />,
            style: extractorShapeStyle(true)
        }
    ]
}