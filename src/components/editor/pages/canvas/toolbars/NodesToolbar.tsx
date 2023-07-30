'use client'

import {Tooltip} from "@mui/material";
import useReactFlowStore from "@/stores/editor/ReactFlowStore";
import {useEffect, useState} from "react";
import {NodeType} from "@/config/NodeType";
import {getAllNodesMetadata, NodeMetadata} from "@/config/NodesMetadata";

export default function NodesToolbar() {

    const onDragStart = (event: any, nodeType: String, nodeData: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, nodeData }));
        event.dataTransfer.effectAllowed = 'move';
    };

    const nodes = useReactFlowStore(state => state.nodes)
    const [isStartAlreadyPlaced, setIsStartAlreadyPlaced] = useState<boolean>(false)

    useEffect(() => {
        setIsStartAlreadyPlaced(nodes.filter(node => node.type === NodeType.START_NODE).length !== 0)
    }, [nodes])

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
                textAlign: "center",
            }}>
                { getAllNodesMetadata().filter((nodeInfo: NodeMetadata) =>
                    nodeInfo.type !== NodeType.START_NODE || !isStartAlreadyPlaced
                ).map(info => (
                   <div style={{
                       width: "100%",
                       display: "flex",
                       flexDirection: "column",
                       alignItems: "center"
                   }}>
                       <Tooltip title={info.title} >
                           <div draggable style={{ ...info.style,
                               minHeight: 50,
                               minWidth: 50,
                               height: 50,
                               width: 50,
                               marginTop: 10,
                               display: "flex",
                               justifyContent: "center",
                               alignItems: "center"
                           }} onDragStart={(event) =>
                               onDragStart(event, info.type, {})
                           }>
                               { info.icon }
                           </div>
                       </Tooltip>
                   </div>
                )) }
            </div>
        </aside>
    );
};