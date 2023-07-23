import Log from "@/components/editor/pages/output/Log";
import Files from "@/components/editor/pages/output/Files";
import React from "react";

export default function OutputPage() {

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