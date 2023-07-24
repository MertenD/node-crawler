import React from "react"
import {IconButton, Tooltip, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import useReactFlowStore from "@/stores/editor/ReactFlowStore";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {CANVAS_HEIGHT} from "@/components/editor/headerbar/HeaderBar";

export interface OptionsContainerProps {
    title: string
    width?: number
    children?: React.ReactNode
    onClose?: () => void
}

export default function OptionsContainer(props: OptionsContainerProps) {

    const isProcessRunning = usePlayStore(state => state.isProcessRunning)

    return (
        <div style={{
            borderRadius: 10,
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
                <Typography variant="h5" style={{ marginBottom: 5 }} >
                    { props.title }
                </Typography>
                <Tooltip title="Close window" >
                    <IconButton disabled={isProcessRunning} onClick={() =>{
                        if (props.onClose !== undefined && props.onClose !== null) {
                            props.onClose()
                        } else {
                            useReactFlowStore.getState().setNodeSelected(null)
                        }
                    }}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            < /div>
            { props.children }
        </div>
    )
}