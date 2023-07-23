'use client'

import {Handle, NodeProps, Position} from "reactflow";
import {handleStyle, nodeBackgroundColor, nodeShadowColor, selectedColor} from "@/stores/editor/ReactFlowStore";
import React, {CSSProperties} from "react";
import OptionsContainer from "@/components/form/OptionsContainer";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {NodeData} from "@/model/NodeData";
import {LoadingButton} from "@mui/lab";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import {usePlayStore} from "@/stores/editor/PlayStore";

export interface StartNodeData extends NodeData {
}

export default function StartNode({ id, selected, data}: NodeProps<StartNodeData>) {

    return (
        <div style={{
            ...startShapeStyle(selected),
            backgroundColor: nodeBackgroundColor,
        }}>
            <Handle id="output" style={handleStyle(selected)} type="source" position={Position.Right}/>
            <div style={{
                width: 60,
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
            }}>
                <PlayArrowIcon />
            </div>
        </div>
    )
}

export function StartOptions(props: {id: string}) {

    return (
        <OptionsContainer title="Start" width={300} >
            <LoadingButton
                endIcon={<PlayCircleFilledIcon />}
                variant="contained"
                onClick={() => {
                    usePlayStore.getState().setup()
                }}
                sx={{
                    width: "100%"
                }}
            >
                Start Crawler
            </LoadingButton>
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