import {NodeType} from "@/config/NodeType";
import React, {CSSProperties} from "react";
import {StartNode, StartOptions, startShapeStyle} from "@/components/editor/pages/canvas/nodes/StartNode";
import {
    FetchWebsiteNode,
    FetchWebsiteOptions,
    fetchWebsiteShapeStyle
} from "@/components/editor/pages/canvas/nodes/FetchWebsiteNode";
import {SaveNode, SaveOptions, saveShapeStyle,} from "@/components/editor/pages/canvas/nodes/SaveNode";

export default function getNodesInformation(
    nodeId: string = ""
): {type: NodeType, node: React.ReactNode, title: string, options: React.ReactNode, style: CSSProperties, isAvailableOnCanvas: boolean}[] {

    return [
        {
            type: NodeType.START_NODE,
            node: StartNode,
            title: "Start",
            options: <StartOptions id={nodeId} />,
            style: startShapeStyle(true),
            isAvailableOnCanvas: false
        },
        {
            type: NodeType.FETCH_WEBSITE_NODE,
            node: FetchWebsiteNode,
            title: "Fetch Website",
            options: <FetchWebsiteOptions id={nodeId}/>,
            style: fetchWebsiteShapeStyle(true),
            isAvailableOnCanvas: true
        },
        {
            type: NodeType.SAVE_NODE,
            node: SaveNode,
            title: "Save",
            options: <SaveOptions id={nodeId} />,
            style: saveShapeStyle(true),
            isAvailableOnCanvas: true
        }
    ]
}