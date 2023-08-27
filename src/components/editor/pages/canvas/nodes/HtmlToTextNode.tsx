'use client'

import React from "react";
import {NodeData} from "@/model/NodeData";
import {
    createStaticNodeComponent,
    createNodeShapeStyle,
    createOptionsComponent
} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {NodeType} from "@/config/NodeType";
import {NodeMetadata} from "@/config/NodesMetadata";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {EngineHtmlToTextNode} from "@/engine/nodes/EngineHtmlToTextNode";


// --- Data ---
export interface HtmlToTextNodeData extends NodeData {
    fileName: string
    extension: string
    separator: string
}


// --- Style ---
export const htmlToTextShapeStyle = createNodeShapeStyle()


// --- Node ---
export const HtmlToTextNode = createStaticNodeComponent<HtmlToTextNodeData>(
    NodeType.HTML_TO_TEXT_NODE,
    htmlToTextShapeStyle,
    () => {
        return <div style={{
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
        }}>
            <SwapHorizIcon />
        </div>
    }
)

// --- Options ---
export const HtmlToTextOptions = createOptionsComponent<HtmlToTextNodeData>("HtmlToText", ({id, data, onDataUpdated}) => {
    return <></>
})


// --- Metadata ---
export const htmlToTextNodeMetadata = {
    title: "HtmlToText",
    type: NodeType.HTML_TO_TEXT_NODE,
    getNodeComponent: HtmlToTextNode,
    getOptionsComponent: (id: string) => <HtmlToTextOptions id={id} />,
    style: htmlToTextShapeStyle(true),
    icon: <SwapHorizIcon />,
    getEngineNode: (id: string, data: NodeData) => {
        return new EngineHtmlToTextNode(id, data as HtmlToTextNodeData)
    }
} as NodeMetadata