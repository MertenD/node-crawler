'use client'

import {ReactFlowProvider} from "reactflow";
import React from "react";
import HeaderBar from "@/components/editor/headerbar/HeaderBar";
import useEditorPageState from "@/stores/editor/EditorPageStore";

export const TOOLBAR_HEIGHT = 8
export const CANVAS_HEIGHT = 100 - TOOLBAR_HEIGHT

export default function Canvas() {

    const selectedPage = useEditorPageState(state => state.selectedPage)
    const getPage = useEditorPageState(state => state.getPage)

    return <div style={{ height: "100vh"}}>
        <ReactFlowProvider>
            <HeaderBar />
            <div style={{ height: `${CANVAS_HEIGHT}vh` }}>
                { getPage(selectedPage)?.child }
            </div>
        </ReactFlowProvider>
    </div>
}