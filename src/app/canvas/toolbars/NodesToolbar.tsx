'use client'

import {NodeTypes} from "@/model/NodeTypes";
import {fetchWebsiteShapeStyle} from "@/app/canvas/nodes/FetchWebsiteNode";
import {Typography} from "@mui/material";

export default function NodesToolbar() {
    const onDragStart = (event: any, nodeType: String, nodeData: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, nodeData }));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            <div style={{
                borderRadius: 10,
                padding: 16,
                background: "#1A202C",
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Typography variant="body1">
                    Fetch Website
                </Typography>
                <div draggable style={{ ...fetchWebsiteShapeStyle(true), marginTop: 10, marginBottom: 10 }} onDragStart={(event) =>
                    onDragStart(event, NodeTypes.FETCH_WEBSITE_NODE, {})
                } />
            </div>
        </aside>
    );
};