import React from "react";
import {startNodeMetadata} from "@/components/editor/pages/canvas/nodes/StartNode";
import {fetchWebsiteNodeMetadata} from "@/components/editor/pages/canvas/nodes/FetchWebsiteNode";
import {saveNodeMetadata,} from "@/components/editor/pages/canvas/nodes/SaveNode";
import {extractorNodeMetadata} from "@/components/editor/pages/canvas/nodes/ExtractorNode";
import {NodeMetadata} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {NodeType} from "@/config/NodeType";

type NodeMetadataType = {
    [K in NodeType]: NodeMetadata | null
}

export const nodesMetadataMap: NodeMetadataType = {
    [NodeType.START_NODE]: startNodeMetadata,
    [NodeType.FETCH_WEBSITE_NODE]: fetchWebsiteNodeMetadata,
    [NodeType.SAVE_NODE]: saveNodeMetadata,
    [NodeType.GATEWAY_NODE]: null,
    [NodeType.EXTRACTOR_NODE]: extractorNodeMetadata,
};

export function getAllNodesMetadata(): NodeMetadata[] {
    return Object
        .values(nodesMetadataMap)
        .filter((metadata): metadata is NodeMetadata => metadata !== null);
}
