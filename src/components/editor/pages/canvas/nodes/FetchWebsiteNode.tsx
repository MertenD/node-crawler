'use client'

import React from "react";
import TextInputOption from "@/components/form/TextInputOption";
import { Badge, Button, IconButton, Typography } from "@mui/material";
import CloudDownloadTwoToneIcon from '@mui/icons-material/CloudDownloadTwoTone';
import {NodeData} from "@/model/NodeData";
import {
    createStaticNodeComponent,
    createNodeShapeStyle,
    createOptionsComponent
} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {EngineFetchWebsiteNode} from "@/engine/nodes/EngineFetchWebsiteNode";
import {NodeType} from "@/config/NodeType";
import {NodeMetadata} from "@/config/NodesMetadata";
import {defaultEdgeColor, selectedColor} from "@/config/colors";
import CloseIcon from "@mui/icons-material/Close";


// --- Data ---
export interface FetchWebsiteNodeData extends NodeData {
    name: string
    urls: string[]
}


// --- Style ---
export const fetchWebsiteShapeStyle = createNodeShapeStyle({
    minWidth: 100
})


// --- Node ---
export const FetchWebsiteNode = createStaticNodeComponent<FetchWebsiteNodeData>(
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

    const [urls, setUrls] = React.useState<string[]>(data.urls ?? [""])

    function addValue() {
        setUrls([...urls, ""])
    }

    return <>
        <TextInputOption
            label="Name"
            value={data.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onDataUpdated("name", event.target.value)
            }}
        />
        {
            urls.map((url, index) => {
                return <TextInputOption
                    key={index}
                    label={"URL " + (index > 0 ? index + 1 : "")}
                    value={url}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const newUrls = [...urls]
                        newUrls[index] = event.target.value
                        setUrls(newUrls)
                        onDataUpdated("urls", newUrls)
                    }}
                    inputProps = {{
                        endAdornment: (
                            index > 0 ?
                                <IconButton onClick={
                                    () => {
                                        const newUrls = [...urls]
                                        newUrls.splice(index, 1)
                                        setUrls(newUrls)
                                        onDataUpdated("urls", newUrls)
                                    }
                                }>
                                    <CloseIcon />
                                </IconButton>
                                :
                                <></>
                        )
                    }}
                />
            })
        }
        <Button onClick={addValue}>Add Url</Button>
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