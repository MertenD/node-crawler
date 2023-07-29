// --- Data ---
import {
    createNodeComponent,
    createNodeShapeStyle,
    createOptionsComponent
} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {NodeData} from "@/model/NodeData";
import {NodeType} from "@/config/NodeType.ts";
import React from "react";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import TextInputOption from "@/components/form/TextInputOption";
import {EngineExtractorNode} from "@/engine/nodes/EngineExtractorNode";
import {NodeMetadata} from "@/config/NodesMetadata";

export interface ExtractorNodeData extends NodeData {
    tag: string
}

// --- Style ---
export const extractorShapeStyle = createNodeShapeStyle()

// --- Node ---
export const ExtractorNode = createNodeComponent<ExtractorNodeData>(
    NodeType.EXTRACTOR_NODE,
    extractorShapeStyle,
    () => {
        return <div style={{
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
        }}>
            <ManageSearchIcon />
        </div>
    }
)

// --- Options ---
export const ExtractorOptions = createOptionsComponent<ExtractorNodeData>("Extractor", ({ id, data, onDataUpdated }) => {
    return <>
        <TextInputOption
            label={"HTML Tag"}
            value={data.tag}
            onChange={(event) => {
                onDataUpdated("tag", event.target.value)
            }}
        />
    </>
})


// --- Metadata ---
export const extractorNodeMetadata = {
    title: "Extractor",
    type: NodeType.EXTRACTOR_NODE,
    getNodeComponent: ExtractorNode,
    getOptionsComponent: (id: string) => <ExtractorOptions id={id} />,
    style: extractorShapeStyle(true),
    icon: <ManageSearchIcon />,
    getEngineNode: (id: string, data: NodeData) => {
        return new EngineExtractorNode(id, data as ExtractorNodeData)
    }
} as NodeMetadata