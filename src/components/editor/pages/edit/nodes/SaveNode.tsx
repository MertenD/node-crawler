'use client'

import {Handle, Node, NodeProps, Position} from "reactflow";
import {
    handleStyle,
    nodeBackgroundColor,
    nodeShadowColor,
    selectedColor,
    useReactFlowStore
} from "@/stores/editor/ReactFlowStore";
import React, {CSSProperties, useEffect, useState} from "react";
import OptionsContainer from "@/components/form/OptionsContainer";
import SaveIcon from '@mui/icons-material/Save';
import TextInputOption from "@/components/form/TextInputOption";
import {setNodeWithUpdatedDataValue} from "@/components/editor/pages/edit/nodes/util/OptionsUtil";
import {NodeData} from "@/model/NodeData";

export interface SaveNodeData extends NodeData {
    fileName: string
}

export default function SaveNode({ id, selected, data}: NodeProps<SaveNodeData>) {

    return (
        <div style={{
            ...saveShapeStyle(selected),
            backgroundColor: nodeBackgroundColor,
        }}>
            <Handle style={handleStyle(selected)} type="target" position={Position.Left}/>
            <div style={{
                width: 60,
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
            }}>
                <SaveIcon />
            </div>
        </div>
    )
}

export function SaveOptions(props: {id: string}) {

    const updateNodeData = useReactFlowStore((state) => state.updateNodeData)
    const getNodeById = useReactFlowStore((state) => state.getNodeById)

    const [localNode, setLocalNode] = useState<Node | null>(null)

    useEffect(() => {
        const currentNode = getNodeById(props.id);
        setLocalNode(currentNode);
    }, [props.id, getNodeById])

    useEffect(() => {
        if (localNode !== null) {
            updateNodeData(props.id, localNode.data as SaveNodeData)
        }
    }, [localNode, updateNodeData])

    return (
        localNode !== null && <OptionsContainer title="Save" >
            <TextInputOption
                label="Filename"
                value={localNode.data.fileName}
                onChange={(event) => {
                    setNodeWithUpdatedDataValue(setLocalNode, "fileName", event.target.value)
                }}
            />
        </OptionsContainer>
    )
}

export const saveShapeStyle = (isSelected: boolean): CSSProperties => {
    return {
        minWidth: 60,
        minHeight: 60,
        backgroundColor: nodeBackgroundColor,
        borderRadius: 6,
        border: "2px solid",
        borderColor: isSelected ? selectedColor : nodeBackgroundColor,
        boxShadow: isSelected ? `0px 0px 5px 1px ${selectedColor}` : `0px 0px 3px 2px ${nodeShadowColor}`
    } as CSSProperties
}