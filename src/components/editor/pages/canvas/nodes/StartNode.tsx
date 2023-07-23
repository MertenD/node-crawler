'use client'

import React from "react";
import {NodeData} from "@/model/NodeData";
import {LoadingButton} from "@mui/lab";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import {usePlayStore} from "@/stores/editor/PlayStore";
import {
    createNodeComponent,
    createNodeShapeStyle,
    createOptionsComponent
} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {NodeType} from "@/config/NodeType";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// --- Data ---
export interface StartNodeData extends NodeData {
}


// --- Style ---
export const startShapeStyle = createNodeShapeStyle({
    borderRadius: "50%"
})


// --- Node ---
export const StartNode = createNodeComponent<StartNodeData>(
    NodeType.START_NODE,
    startShapeStyle,
    () => {
        return <div style={{
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
        }}>
            <PlayArrowIcon />
        </div>
    }
)

// --- Options ---
export const StartOptions = createOptionsComponent<StartNodeData>("Start", () => {
    return <LoadingButton
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
})