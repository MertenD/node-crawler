import React from "react";

export interface RowOptionsContainerProps {
    children?: React.ReactNode
}

export default function RowOptionsContainer(props: RowOptionsContainerProps) {

    return <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10
    }}>
        { props.children }
    </div>
}