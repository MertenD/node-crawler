import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import getNodesInformation from "@/config/NodesInformation";
import {Tooltip, Typography} from "@mui/material";
import {NodeType} from "@/config/NodeType";
import {Node} from "reactflow";
import {connectionRules} from "@/config/ConnectionRules";

export interface OnCanvasNodesToolbarProps {
    open: boolean;
    position: {x: number, y: number}
    onClose: (nodeType: NodeType | null) => void;
    sourceNode: Node | null
}

export default function OnCanvasNodesToolbar(props: OnCanvasNodesToolbarProps) {
    const { onClose, open, position } = props;
    // Change width and height when adding new elements to toolbar
    const width = 160
    const height = 500

    const handleClose = () => {
        onClose(null)
    }

    const handleNodeSelected = (nodeType: NodeType) => {
        onClose(nodeType);
    };

    return (
        <Dialog PaperProps={{
            sx: {
                position: "fixed",
                m: 0,
                left: Math.min(position.x, window.innerWidth - width - 16),
                top: Math.min(position.y, window.innerHeight - height - 16),
                background: "#1A202C",
                borderRadius: 2,
            }
        }} onClose={handleClose} open={open}>
            <DialogTitle>
                <Typography variant={"h5"}>Select Node</Typography>
            </DialogTitle>
            <div style={{
                paddingLeft: 16,
                paddingRight: 16,
                paddingBottom: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                marginBottom: 20,
                textAlign: "center"
            }}>
                { getNodesInformation().filter(nodeInfo => {
                    if (nodeInfo.type === NodeType.START_NODE) {
                        return false
                    }
                    if (props.sourceNode === null) {
                        return true
                    }

                    const sourceOutputValue = connectionRules.find(rule => rule.nodeType === props.sourceNode?.type)?.outputValueType
                    const currentNodeInputRules = connectionRules.find(rule => rule.nodeType === nodeInfo.type)?.inputRules

                    // TODO Nochmal weiter überlegen, wie ich das handhabe, sobald ich einen node mit mehr als einem Eingang hab
                    if (currentNodeInputRules?.length > 1) {
                        return false
                    }

                    return currentNodeInputRules[0].allowedValueTypes.includes(sourceOutputValue)
                }).map(info => (
                    <Tooltip title={info.title}>
                        <div draggable style={{
                            ...info.style,
                            minHeight: 50,
                            minWidth: 50,
                            height: 50,
                            width: 50,
                            marginTop: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }} onClick={() =>
                            handleNodeSelected(info.type)
                        } >
                            { info.icon }
                        </div>
                    </Tooltip>
                )) }
            </div>
        </Dialog>
    );
}