'use client'

import React from "react";
import TextInputOption from "@/components/form/TextInputOption";
import {Badge, Typography} from "@mui/material";
import CloudDownloadTwoToneIcon from '@mui/icons-material/CloudDownloadTwoTone';
import {NodeData} from "@/model/NodeData";
import {
    createNodeComponent,
    createNodeShapeStyle,
    createOptionsComponent, NodeMetadata
} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {EngineFetchWebsiteNode} from "@/engine/nodes/EngineFetchWebsiteNode";
import {NodeType} from "@/config/NodeType";
import {defaultEdgeColor, selectedColor} from "@/app/layout";


// --- Data ---
export interface FetchWebsiteNodeData extends NodeData {
    name: string
    url: string
}


// --- Style ---
export const fetchWebsiteShapeStyle = createNodeShapeStyle({
    minWidth: 100
})


// --- Node ---
export const FetchWebsiteNode = createNodeComponent<FetchWebsiteNodeData>(
    NodeType.FETCH_WEBSITE_NODE,
    fetchWebsiteShapeStyle,
    (id, selected, data) => {
        return <Badge badgeContent={<CloudDownloadTwoToneIcon sx={{
            color: selected ? selectedColor : defaultEdgeColor
        }}/>} anchorOrigin={{ horizontal: "left", vertical: "top" }} >
            <div style={{
                width: 100,
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
            }}>
                <Typography variant="body1">
                    { (data.name && data.name !== "") ? data.name : "Fetch Website" }
                </Typography>
            </div>
        </Badge>
    }
)


// --- Options ---
export const FetchWebsiteOptions = createOptionsComponent<FetchWebsiteNodeData>("Fetch Website", ({ id, data, onDataUpdated }) => {
    return <>
        <TextInputOption
            label="Name"
            value={data.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onDataUpdated("name", event.target.value)
            }}
        />
        <TextInputOption
            label="URL"
            value={data.url}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onDataUpdated("url", event.target.value)
            }}
        />
    </>
})


// --- Metadata ---
export const fetchWebsiteNodeMetadata = {
    title: "Fetch Website",
    type: NodeType.FETCH_WEBSITE_NODE,
    getNodeComponent: FetchWebsiteNode,
    getOptionsComponent: (id: string) => <FetchWebsiteOptions id={id}/>,
    style: fetchWebsiteShapeStyle(true),
    icon: <CloudDownloadTwoToneIcon />,
    getEngineNode: (id: string, data: NodeData) => {
        return new EngineFetchWebsiteNode(id, data as FetchWebsiteNodeData)
    }
} as NodeMetadata