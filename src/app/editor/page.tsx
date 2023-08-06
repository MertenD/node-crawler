'use client'

import {ReactFlowProvider, useReactFlow} from "reactflow";
import React, {useEffect} from "react";
import HeaderBar, {CANVAS_HEIGHT} from "@/components/editor/headerbar/HeaderBar";
import useEditorPageState from "@/stores/editor/EditorPageStore";
import {Alert, Snackbar} from "@mui/material";
import Engine from "@/components/editor/Engine";
import useReactFlowStore from "@/stores/editor/ReactFlowStore";

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

    useEffect(() => {
        window.addEventListener('beforeunload', preventReload)
        return () => {
            window.removeEventListener('beforeunload', preventReload)
        }
    }, [])

    const preventReload = (e: Event) => {
        e.preventDefault()
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