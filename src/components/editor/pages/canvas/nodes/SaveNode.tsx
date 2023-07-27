'use client'

import React from "react";
import {NodeData} from "@/model/NodeData";
import FileNameInputOption from "@/components/form/FileNameInputOption";
import TextInputOption from "@/components/form/TextInputOption";
import {
    createNodeComponent,
    createNodeShapeStyle,
    createOptionsComponent,
    NodeMetadata
} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {NodeType} from "@/config/NodeType.ts";
import SaveIcon from '@mui/icons-material/Save';
import {EngineSaveNode} from "@/engine/nodes/EngineSaveNode";


// --- Data ---
export interface SaveNodeData extends NodeData {
    fileName: string
    extension: string
    separator: string
}


// --- Style ---
export const saveShapeStyle = createNodeShapeStyle()


// --- Node ---
export const SaveNode = createNodeComponent<SaveNodeData>(
    NodeType.SAVE_NODE,
    saveShapeStyle,
    () => {
        return <div style={{
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
        }}>
            <SaveIcon />
        </div>
    }
)

// --- Options ---
export const SaveOptions = createOptionsComponent<SaveNodeData>("Save", ({id, data, onDataUpdated}) => {
    return <>
        <FileNameInputOption
            fileName={data.fileName}
            onFileNameChange={(event) => {
                onDataUpdated("fileName", event.target.value)
            }}
            extension={data.extension}
            onExtensionChange={(event) => {
                onDataUpdated("extension", event.target.value)
            }}
        />
        <TextInputOption
            label={"Content separator (For multiple inputs)"}
            value={data.separator}
            onChange={(event) => {
                onDataUpdated("separator", event.target.value)
            }}
        />
    </>
})


// --- Metadata ---
export const saveNodeMetadata = {
    title: "Save",
    type: NodeType.SAVE_NODE,
    getNodeComponent: SaveNode,
    getOptionsComponent: (id: string) => <SaveOptions id={id} />,
    style: saveShapeStyle(true),
    icon: <SaveIcon />,
    getEngineNode: (id: string, data: NodeData) => {
        return new EngineSaveNode(id, data as SaveNodeData)
    }
} as NodeMetadata