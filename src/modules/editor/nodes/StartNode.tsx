'use client'

import {Handle, NodeProps, Position} from "reactflow";
import {handleStyle, nodeBackgroundColor, nodeShadowColor, selectedColor} from "@/stores/ReactFlowStore";
import {Typography} from "@mui/material";
import React, {CSSProperties} from "react";
import OptionsContainer from "@/modules/form/OptionsContainer";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export type StartNodeData = {
}

export default function StartNode({ id, selected, data}: NodeProps<StartNodeData>) {

    return (
        <div style={{
            ...startShapeStyle(selected),
            backgroundColor: nodeBackgroundColor,
        }}>
            <Handle style={handleStyle(selected)} type="source" position={Position.Right}/>
            <div style={{
                width: 60,
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
            }}>
                <Typography variant="h5">
                    >
                </Typography>
            </div>
        </div>
    )
}

export function StartOptions(props: {id: string}) {

    return (
        <OptionsContainer title="Start" >
            <Typography variant="body1">
                This is the start of the crawler. There are no options.
            </Typography>
        </OptionsContainer>
    )
}

export const startShapeStyle = (isSelected: boolean): CSSProperties => {
    return {
        minWidth: 60,
        minHeight: 60,
        backgroundColor: nodeBackgroundColor,
        borderRadius: "50%",
        border: "2px solid",
        borderColor: isSelected ? selectedColor : nodeBackgroundColor,
        boxShadow: isSelected ? `0px 0px 5px 1px ${selectedColor}` : `0px 0px 3px 2px ${nodeShadowColor}`
    } as CSSProperties
}