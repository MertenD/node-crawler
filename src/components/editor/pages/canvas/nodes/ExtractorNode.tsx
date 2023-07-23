

// --- Data ---
import {
    createNodeComponent,
    createNodeShapeStyle,
    createOptionsComponent
} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {NodeData} from "@/model/NodeData";
import {NodeType} from "@/config/NodeType";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import TextInputOption from "@/components/form/TextInputOption";

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
export const ExtractorOptions = createOptionsComponent<ExtractorNodeData>("Start", ({ id, data, onDataUpdated }) => {
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