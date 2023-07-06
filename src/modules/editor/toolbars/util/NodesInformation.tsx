import {NodeTypes} from "@/model/NodeTypes";
import React, {CSSProperties} from "react";
import {FetchWebsiteOptions, fetchWebsiteShapeStyle} from "@/modules/editor/nodes/FetchWebsiteNode";
import {StartOptions, startShapeStyle} from "@/modules/editor/nodes/StartNode";
import {SaveOptions, saveShapeStyle} from "@/modules/editor/nodes/SaveNode";

export default function getNodesInformation(
    nodeId: string = ""
): {type: NodeTypes, title: string, options: React.ReactNode, style: CSSProperties, isAvailableOnCanvas: boolean}[] {

    return [
        {
            type: NodeTypes.START_NODE,
            title: "Start",
            options: <StartOptions id={nodeId} />,
            style: startShapeStyle(true),
            isAvailableOnCanvas: false
        },
        {
            type: NodeTypes.FETCH_WEBSITE_NODE,
            title: "Fetch Website",
            options: <FetchWebsiteOptions id={nodeId}/>,
            style: fetchWebsiteShapeStyle(true),
            isAvailableOnCanvas: true
        },
        {
            type: NodeTypes.SAVE_NODE,
            title: "Save",
            options: <SaveOptions id={nodeId} />,
            style: saveShapeStyle(true),
            isAvailableOnCanvas: true
        }
    ]
}