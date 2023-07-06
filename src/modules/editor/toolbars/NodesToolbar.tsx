'use client'

import {NodeTypes} from "@/model/NodeTypes";
import {fetchWebsiteShapeStyle} from "@/modules/editor/nodes/FetchWebsiteNode";
import {Typography} from "@mui/material";
import getNodesInformation from "@/modules/editor/toolbars/util/NodesInformation";

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
                gap: 20,
                paddingBottom: 20,
                textAlign: "center"
            }}>
                { getNodesInformation().map(info => (
                   <div>
                       <Typography variant="body1">
                           { info.title }
                       </Typography>
                       <div draggable style={{ ...info.style, marginTop: 10 }} onDragStart={(event) =>
                           onDragStart(event, info.type, {})
                       } />
                   </div>
                )) }
            </div>
        </aside>
    );
};