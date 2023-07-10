'use client'

import {ReactFlowProvider} from "reactflow";
import React from "react";
import DragAndDropFlow from "@/modules/editor/DragAndDropFlow";
import HeaderBar from "@/modules/editor/headerbar/HeaderBar";

export const TOOLBAR_HEIGHT = 8
export const CANVAS_HEIGHT = 100 - TOOLBAR_HEIGHT

export default function Canvas() {

    return <div style={{ height: "100vh"}}>
        <ReactFlowProvider>
            <HeaderBar />
            <div style={{ height: `${CANVAS_HEIGHT}vh` }}>
                <DragAndDropFlow />
            </div>
        </ReactFlowProvider>
    </div>
}