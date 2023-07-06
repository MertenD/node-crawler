'use client'

import {Handle, Node, NodeProps, Position} from "reactflow";
import {
    handleStyle,
    nodeBackgroundColor,
    nodeShadowColor,
    selectedColor,
    useReactFlowStore
} from "@/stores/ReactFlowStore";
import {TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";

export type FetchWebsiteNodeData = {
    content: string
}

export default function FetchWebsiteNode({ id, selected, data}: NodeProps<FetchWebsiteNodeData>) {

    return (
        <div style={{
            ...fetchWebsiteShapeStyle(selected),
            backgroundColor: nodeBackgroundColor,
        }}>
            <Handle style={handleStyle(selected)} type="source" position={Position.Right}/>
            <Handle style={handleStyle(selected)} type="target" position={Position.Left}/>
            <div style={{
                width: 100,
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
            }}>
                Fetch website
            </div>
        </div>
    )
}

export function FetchWebsiteOptions(props: {id: string}) {
    const updateNodeData = useReactFlowStore((state) => state.updateNodeData)
    const getNodeById = useReactFlowStore((state) => state.getNodeById)

    const [localNode, setLocalNode] = useState<Node | null>(null)

    useEffect(() => {
        const currentNode = getNodeById(props.id);
        setLocalNode(currentNode);
    }, [])

    useEffect(() => {
        if (localNode !== null) {
            updateNodeData(props.id, localNode.data as FetchWebsiteNodeData)
        }

        const updatedNode = getNodeById(props.id);
        setLocalNode(updatedNode);
    }, [props.id, localNode, updateNodeData])

    return (
        localNode !== null && <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            margin: 20
        }}>
            <Typography variant="h5" >
                Fetch Website
            </Typography>
            <div />
            <TextField
                id="contentTextField"
                label="Content"
                variant="outlined"
                value={localNode.data.content}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setLocalNode((node) => {
                        if (node !== null) {
                            node.data.content = event.target.value
                        }
                        return node
                    })
                }}
                sx={{
                    input: {
                        color: "white"
                    }
                }}
            />
            { localNode.data.content }
        </div>
    )
}

export const fetchWebsiteShapeStyle = (isSelected: boolean) => {
    return {
        minWidth: 100,
        minHeight: 60,
        backgroundColor: nodeBackgroundColor,
        borderRadius: 6,
        border: "2px solid",
        borderColor: isSelected ? selectedColor : nodeBackgroundColor,
        boxShadow: isSelected ? `0px 0px 5px 1px ${selectedColor}` : `0px 0px 3px 2px ${nodeShadowColor}`
    }
}