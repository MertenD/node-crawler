'use client'

import {Handle, Node, NodeProps, Position} from "reactflow";
import {
    defaultEdgeColor,
    handleStyle,
    nodeBackgroundColor,
    nodeShadowColor,
    selectedColor,
    useReactFlowStore
} from "@/stores/editor/ReactFlowStore";
import React, {CSSProperties, useEffect, useState} from "react";
import {setNodeWithUpdatedDataValue} from "@/components/editor/pages/edit/nodes/util/OptionsUtil";
import OptionsContainer from "@/components/form/OptionsContainer";
import TextInputOption from "@/components/form/TextInputOption";
import {Badge, Typography} from "@mui/material";
import CloudDownloadTwoToneIcon from '@mui/icons-material/CloudDownloadTwoTone';
import {NodeData} from "@/model/NodeData";

export interface FetchWebsiteNodeData extends NodeData {
    name: string
    url: string
}

export default function FetchWebsiteNode({ id, selected, data}: NodeProps<FetchWebsiteNodeData>) {

    return (
        <div style={{
            ...fetchWebsiteShapeStyle(selected),
            backgroundColor: nodeBackgroundColor,
        }}>
            <Handle id="output" style={handleStyle(selected)} type="source" position={Position.Right}/>
            <Handle id="input" style={handleStyle(selected)} type="target" position={Position.Left}/>
            <Badge badgeContent={<CloudDownloadTwoToneIcon sx={{
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
            <TextInputOption
                label="Name"
                value={localNode.data.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setNodeWithUpdatedDataValue(setLocalNode,"name", event.target.value)
                }}
            />
            <TextInputOption
                label="URL"
                value={localNode.data.url}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setNodeWithUpdatedDataValue(setLocalNode,"url", event.target.value)
                }}
            />
        </OptionsContainer>
    )
}

export const fetchWebsiteShapeStyle = (isSelected: boolean): CSSProperties => {
    return {
        minWidth: 100,
        minHeight: 60,
        backgroundColor: nodeBackgroundColor,
        borderRadius: 6,
        border: "2px solid",
        borderColor: isSelected ? selectedColor : nodeBackgroundColor,
        boxShadow: isSelected ? `0px 0px 5px 1px ${selectedColor}` : `0px 0px 3px 2px ${nodeShadowColor}`
    } as CSSProperties
}