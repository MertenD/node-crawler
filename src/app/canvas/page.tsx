'use client'

import {ReactFlowProvider} from "reactflow";
import React from "react";
import DragAndDropFlow from "@/app/canvas/DragAndDropFlow";

export default function Canvas() {

    return <div style={{ height: "100vh"}}>
        <ReactFlowProvider>
            <DragAndDropFlow />
        </ReactFlowProvider>
    </div>
}