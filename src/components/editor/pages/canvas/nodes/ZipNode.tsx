'use client'

import React from "react";
import {NodeData} from "@/model/NodeData";
import {
    createNodeComponent,
    createNodeShapeStyle,
    createOptionsComponent
} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {NodeType} from "@/config/NodeType";
import {NodeMetadata} from "@/config/NodesMetadata";
import MergeIcon from '@mui/icons-material/Merge';
import {EngineZipNode} from "@/engine/nodes/EngineZipNode";

// TODO beliebig viele Inputs jeweils mit Namen einstellbar in den Optionen. Dafür muss ziemlich sicher wieder etwas an den connectionRules geändert werden

// --- Data ---
export interface ZipNodeData extends NodeData {
}


// --- Style ---
export const zipShapeStyle = createNodeShapeStyle({})


// --- Node ---
export const ZipNode = createNodeComponent<ZipNodeData>(
    NodeType.ZIP_NODE,
    zipShapeStyle,
    () => {
        return <div style={{
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
        }}>
            <MergeIcon style={{ transform: 'rotate(90deg)' }} />
        </div>
    }
)

// --- Options ---
export const ZipOptions = createOptionsComponent<ZipNodeData>("Zip", () => {
    return <></>
})


// --- Metadata ---
export const zipNodeMetadata = {
    title: "Zip",
    type: NodeType.ZIP_NODE,
    getNodeComponent: ZipNode,
    getOptionsComponent: (id: string) => <ZipOptions id={id}/>,
    style: zipShapeStyle(true),
    icon: <MergeIcon style={{ transform: 'rotate(90deg)' }}/>,
    getEngineNode: (id: string, data: NodeData) => {
        return new EngineZipNode(id, data as ZipNodeData)
    }
} as NodeMetadata