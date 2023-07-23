import Log from "@/components/editor/pages/play/Log";
import Files from "@/components/editor/pages/play/Files";
import React from "react";

export default function PlayPage() {

    return <div style={{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        width: "100%",
        height: "100%",
        padding: 20,
    }}>
        <Log />
        <Files />
    </div>
}