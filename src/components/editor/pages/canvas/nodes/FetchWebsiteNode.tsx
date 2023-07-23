'use client'

import {defaultEdgeColor, selectedColor} from "@/stores/editor/ReactFlowStore";
import React from "react";
import TextInputOption from "@/components/form/TextInputOption";
import {Badge, Typography} from "@mui/material";
import CloudDownloadTwoToneIcon from '@mui/icons-material/CloudDownloadTwoTone';
import {NodeData} from "@/model/NodeData";
import {
    createNodeComponent,
    createNodeShapeStyle,
    createOptionsComponent
} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {NodeType} from "@/config/NodeType";


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