import {NodeData} from "@/model/NodeData";
import {
    createNodeComponent,
    createNodeShapeStyle,
    createOptionsComponent
} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {NodeType} from "@/config/NodeType";
import React from "react";
import MergeIcon from '@mui/icons-material/Merge';
import {EngineMergeNode} from "@/engine/nodes/EngineMergeNode";
import {NodeMetadata} from "@/config/NodesMetadata";


// --- Data ---
export interface MergeNodeData extends NodeData {

}


// --- Style ---
export const mergeShapeStyle = createNodeShapeStyle({})


// --- Node ---
export const MergeNode = createNodeComponent<MergeNodeData>(
    NodeType.MERGE_NODE,
    mergeShapeStyle,
    () => {
        return <div style={{
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
        }}>
            <MergeIcon style={{ transform: "rotate(90deg)" }} />
        </div>
    }
)


// --- Options ---
export const MergeOptions = createOptionsComponent<MergeNodeData>("Merge", () => {
    return <></>
})


// --- Metadata ---
export const mergeNodeMetadata = {
    title: "Merge",
    type: NodeType.MERGE_NODE,
    getNodeComponent: MergeNode,
    getOptionsComponent: (id: string) => <MergeOptions id={id} />,
    style: mergeShapeStyle(true),
    icon: <MergeIcon style={{ transform: "rotate(90deg)" }} />,
    getEngineNode: (id: string, data: NodeData) => {
        return new EngineMergeNode(id, data as MergeNodeData)
    }
} as NodeMetadata