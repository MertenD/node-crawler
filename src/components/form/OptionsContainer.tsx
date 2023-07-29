import React from "react"
import {IconButton, Tooltip, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import useReactFlowStore from "@/stores/editor/ReactFlowStore";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {CANVAS_HEIGHT} from "@/components/editor/headerbar/HeaderBar";
import {defaultEdgeColor} from "@/app/layout";

export interface OptionsContainerProps {
    title: string
    nodeId?: string
    width?: number
    children?: React.ReactNode
    onClose?: () => void
}

export default function OptionsContainer(props: OptionsContainerProps) {

    const isProcessRunning = usePlayStore(state => state.isProcessRunning)

    return (
        <div style={{
            borderRadius: 10,
            borderTopRightRadius: isProcessRunning ? 0 : 10,
            background: "#1A202C",
            display: "flex",
            flexDirection: "column",
            alignItems: 'center',
            justifyContent: 'center',
            width: props.width || 500,
            maxHeight: `${0.7 * CANVAS_HEIGHT}vh`,
            overflowY: "auto",
            padding: 25,
            gap: 20
        }}>
            <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "end",
                    gap: 20
                }}>
                    <Typography variant="h5" style={{ marginBottom: 5 }} >
                        { props.title }
                    </Typography>
                    { props.nodeId && <Tooltip title={props.nodeId}>
                        <Typography variant="body2" style={{ color: defaultEdgeColor, marginBottom: 5 }} >
                            { props.nodeId.substring(0, 8) }...
                        </Typography>
                    </Tooltip> }
                </div>
                { !isProcessRunning && <Tooltip title="Close window" >
                    <IconButton onClick={() =>{
                        if (props.onClose !== undefined && props.onClose !== null) {
                            props.onClose()
                        } else {
                            useReactFlowStore.getState().setNodeSelected(null)
                        }
                    }}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip> }
            </div>
            { props.children }
        </div>
    )
}