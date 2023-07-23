import {NodeTypes} from "@/model/NodeTypes";
import React, {CSSProperties} from "react";
import StartNode, {StartOptions, startShapeStyle} from "@/components/editor/pages/canvas/nodes/StartNode";
import FetchWebsiteNode, {FetchWebsiteOptions, fetchWebsiteShapeStyle} from "@/components/editor/pages/canvas/nodes/FetchWebsiteNode";
import SaveNode, {SaveOptions, saveShapeStyle} from "@/components/editor/pages/canvas/nodes/SaveNode";

export default function getNodesInformation(
    nodeId: string = ""
): {node: React.ReactNode, type: NodeTypes, title: string, options: React.ReactNode, style: CSSProperties, isAvailableOnCanvas: boolean}[] {

    return [
        {
            node: StartNode,
            type: NodeTypes.START_NODE,
            title: "Start",
            options: <StartOptions id={nodeId} />,
            style: startShapeStyle(true),
            isAvailableOnCanvas: false
        },
        {
            node: FetchWebsiteNode,
            type: NodeTypes.FETCH_WEBSITE_NODE,
            title: "Fetch Website",
            options: <FetchWebsiteOptions id={nodeId}/>,
            style: fetchWebsiteShapeStyle(true),
            isAvailableOnCanvas: true
        },
        {
            node: SaveNode,
            type: NodeTypes.SAVE_NODE,
            title: "Save",
            options: <SaveOptions id={nodeId} />,
            style: saveShapeStyle(true),
            isAvailableOnCanvas: true
        }
    ]
}