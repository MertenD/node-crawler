'use client'

import {Handle, Node, NodeProps, Position} from "reactflow";
import {
    handleStyle,
    nodeBackgroundColor,
    nodeShadowColor,
    selectedColor,
    useReactFlowStore
} from "@/stores/ReactFlowStore";
import {TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {setNodeWithUpdatedDataValue} from "@/modules/editor/nodes/util/OptionsUtil";
import OptionsContainer from "@/modules/form/OptionsContainer";

export type FetchWebsiteNodeData = {
    url: string
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
    }, [props.id, getNodeById])

    useEffect(() => {
        if (localNode !== null) {
            updateNodeData(props.id, localNode.data as FetchWebsiteNodeData)
        }
    }, [localNode, updateNodeData])

    return (
        localNode !== null && <OptionsContainer title="Fetch Website">
            <TextField
                fullWidth
                id="contentTextField"
                label="URL"
                variant="outlined"
                value={localNode.data.url || ""}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setNodeWithUpdatedDataValue(setLocalNode,"url", event.target.value)
                }}
            />
        </OptionsContainer>
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