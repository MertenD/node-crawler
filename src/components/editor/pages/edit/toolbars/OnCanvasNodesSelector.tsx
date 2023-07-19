'use client'

import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {NodeTypes} from "@/model/NodeTypes";
import {toolbarBackgroundColor} from "@/stores/editor/ReactFlowStore";
import {Typography} from "@mui/material";
import getNodesInformation from "@/components/editor/pages/edit/nodes/util/NodesInformation";

export interface OnCanvasNodesToolbarProps {
    open: boolean;
    position: {x: number, y: number}
    onClose: (nodeType: NodeTypes | null) => void;
}

export default function OnCanvasNodesToolbar(props: OnCanvasNodesToolbarProps) {
    const { onClose, open, position } = props;
    // Change width and height when adding new elements to toolbar
    const width = 160
    const height = 500

    const handleClose = () => {
        onClose(null)
    }

    const handleNodeSelected = (nodeType: NodeTypes) => {
        onClose(nodeType);
    };

    return (
        <Dialog PaperProps={{
            sx: {
                background: toolbarBackgroundColor,
                color: "white",
                position: "fixed",
                m: 0,
                left: Math.min(position.x, window.innerWidth - width - 16),
                top: Math.min(position.y, window.innerHeight - height - 16)
            }
        }} onClose={handleClose} open={open}>
            <DialogTitle>Select Node</DialogTitle>
            <div style={{
                paddingBottom: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20
            }}>
                { getNodesInformation().filter(info => info.isAvailableOnCanvas).map(info => (
                    <>
                        <Typography variant="body1">
                            { info.title }
                        </Typography>
                        <div style={{ ...info.style }} onClick={() => {
                            handleNodeSelected(info.type)
                        }}/>
                    </>
                )) }
            </div>
        </Dialog>
    );
}