'use client'

import {Typography} from "@mui/material";
import getNodesInformation from "@/components/editor/pages/canvas/nodes/util/NodesInformation";
import useReactFlowStore from "@/stores/editor/ReactFlowStore";
import {useEffect, useState} from "react";
import {NodeTypes} from "@/model/NodeTypes";

export default function NodesToolbar() {

    const onDragStart = (event: any, nodeType: String, nodeData: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, nodeData }));
        event.dataTransfer.effectAllowed = 'move';
    };

    const nodes = useReactFlowStore(state => state.nodes)
    const [isStartAlreadyPlaced, setIsStartAlreadyPlaced] = useState<boolean>(false)

    useEffect(() => {
        setIsStartAlreadyPlaced(nodes.filter(node => node.type === NodeTypes.START_NODE).length !== 0)
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
                textAlign: "center"
            }}>
                { getNodesInformation().filter(nodeInfo =>
                    nodeInfo.type !== NodeTypes.START_NODE || !isStartAlreadyPlaced
                ).map(info => (
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