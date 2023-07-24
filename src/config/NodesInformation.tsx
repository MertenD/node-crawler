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
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SaveIcon from "@mui/icons-material/Save";
import CloudDownloadTwoToneIcon from "@mui/icons-material/CloudDownloadTwoTone";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function getNodesInformation(
    nodeId: string = ""
): {type: NodeType, node: React.ReactNode, title: string, options: React.ReactNode, style: CSSProperties, icon: React.ReactNode}[] {

    return [
        {
            type: NodeType.START_NODE,
            title: "Start",
            node: StartNode,
            options: <StartOptions id={nodeId} />,
            style: startShapeStyle(true),
            icon: <PlayArrowIcon />
        },
        {
            type: NodeType.FETCH_WEBSITE_NODE,
            title: "Fetch Website",
            node: FetchWebsiteNode,
            options: <FetchWebsiteOptions id={nodeId}/>,
            style: fetchWebsiteShapeStyle(true),
            icon: <CloudDownloadTwoToneIcon />
        },
        {
            type: NodeType.SAVE_NODE,
            title: "Save",
            node: SaveNode,
            options: <SaveOptions id={nodeId} />,
            style: saveShapeStyle(true),
            icon: <SaveIcon />
        },
        {
            type: NodeType.EXTRACTOR_NODE,
            title: "Extractor",
            node: ExtractorNode,
            options: <ExtractorOptions id={nodeId} />,
            style: extractorShapeStyle(true),
            icon: <ManageSearchIcon />
        }
    ]
}