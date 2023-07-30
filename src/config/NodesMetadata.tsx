import React, {CSSProperties} from "react";
import {fetchWebsiteNodeMetadata} from "@/components/editor/pages/canvas/nodes/FetchWebsiteNode";
import {saveNodeMetadata,} from "@/components/editor/pages/canvas/nodes/SaveNode";
import {extractorNodeMetadata} from "@/components/editor/pages/canvas/nodes/ExtractorNode";
import {NodeType} from "@/config/NodeType";
import {NodeProps} from "reactflow";
import {NodeData} from "@/model/NodeData";
import {BasicNode} from "@/engine/nodes/BasicNode";
import {startNodeMetadata} from "@/components/editor/pages/canvas/nodes/StartNode";
import {zipNodeMetadata} from "@/components/editor/pages/canvas/nodes/ZipNode";
import {htmlToTextNodeMetadata} from "@/components/editor/pages/canvas/nodes/HtmlToTextNode";

export const nodesMetadataMap: NodeMetadataType = {
    [NodeType.START_NODE]: startNodeMetadata,
    [NodeType.FETCH_WEBSITE_NODE]: fetchWebsiteNodeMetadata,
    [NodeType.SAVE_NODE]: saveNodeMetadata,
    [NodeType.GATEWAY_NODE]: null,
    [NodeType.EXTRACTOR_NODE]: extractorNodeMetadata,
    [NodeType.ZIP_NODE]: zipNodeMetadata,
    [NodeType.HTML_TO_TEXT_NODE]: htmlToTextNodeMetadata
};

// --- Do not change anything below --- \\

export function getAllNodesMetadata(): NodeMetadata[] {
    return Object
        .values(nodesMetadataMap)
        .filter((metadata): metadata is NodeMetadata => metadata !== null);
}

export type NodeMetadata = {
    title: string,
    type: NodeType,
    getNodeComponent: ({id, selected, data}: NodeProps) => React.ReactNode,
    getOptionsComponent: (id: string) => React.ReactNode,
    style: CSSProperties,
    icon: React.ReactNode,
    getEngineNode: (id: string, data: NodeData) => BasicNode
}

type NodeMetadataType = {
    [K in NodeType]: NodeMetadata | null
}