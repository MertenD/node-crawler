'use client'

import {ReactFlowProvider} from "reactflow";
import React from "react";
import HeaderBar from "@/components/editor/headerbar/HeaderBar";
import useEditorPageState from "@/stores/editor/EditorPageStore";
import {Alert, Snackbar} from "@mui/material";
import Engine from "@/components/editor/pages/play/Engine";

export const TOOLBAR_HEIGHT = 8
export const CANVAS_HEIGHT = 100 - TOOLBAR_HEIGHT

export default function Canvas() {

    const selectedPage = useEditorPageState(state => state.selectedPage)
    const getPage = useEditorPageState(state => state.getPage)

    const isSnackBarOpen = useEditorPageState(state => state.isSnackBarOpen)
    const setIsSnackBarOpen = useEditorPageState(state => state.setIsSnackBarOpen)
    const snackBarSeverity = useEditorPageState(state => state.snackBarSeverity)
    const snackBarText = useEditorPageState(state => state.snackBarText)

    const handleOnSnackBarClosed = () => {
        setIsSnackBarOpen(false)
    }

    return <div style={{ height: "100vh"}}>
        <ReactFlowProvider>
            <HeaderBar />
            <Snackbar
                open={isSnackBarOpen}
                autoHideDuration={3000}
                onClose={handleOnSnackBarClosed}
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
            >
                <Alert onClose={handleOnSnackBarClosed} severity={snackBarSeverity} sx={{ width: '100%' }}>
                    { snackBarText }
                </Alert>
            </Snackbar>
            <Engine />
            <div style={{ height: `${CANVAS_HEIGHT}vh` }}>
                { getPage(selectedPage)?.child }
            </div>
        </ReactFlowProvider>
    </div>
}