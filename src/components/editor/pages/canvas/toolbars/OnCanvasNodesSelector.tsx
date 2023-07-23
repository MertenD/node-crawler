import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import getNodesInformation from "@/config/NodesInformation";
import {Typography} from "@mui/material";
import {NodeTypes} from "@/model/NodeTypes";
import {Node} from "reactflow";
import {connectionRules} from "@/config/ConnectionRules";

export interface OnCanvasNodesToolbarProps {
    open: boolean;
    position: {x: number, y: number}
    onClose: (nodeType: NodeTypes | null) => void;
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

    const handleNodeSelected = (nodeType: NodeTypes) => {
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
                <Typography variant={"h4"}>Select Node</Typography>
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
                    if (nodeInfo.type === NodeTypes.START_NODE) {
                        return false
                    }
                    if (props.sourceNode === null) {
                        return true
                    }

                    const sourceOutputValue = connectionRules.find(rule => rule.nodeType === props.sourceNode?.type)?.outputValueType
                    const currentNodeInputRules = connectionRules.find(rule => rule.nodeType === nodeInfo.type).inputRules

                    // TODO Nochmal weiter überlegen, wie ich das handhabe, sobald ich einen node mit mehr als einem Eingang hab
                    if (currentNodeInputRules.length > 1) {
                        return false
                    }

                    return currentNodeInputRules[0].allowedValueTypes.includes(sourceOutputValue)
                }).map(info => (
                    <div>
                        <Typography variant="body1">
                            { info.title }
                        </Typography>
                        <div draggable style={{ ...info.style, marginTop: 10 }} onClick={(event) =>
                            handleNodeSelected(info.type)
                        } />
                    </div>
                )) }
            </div>
        </Dialog>
    );
}