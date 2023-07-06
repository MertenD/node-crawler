import React from "react"
import {Typography} from "@mui/material";

export interface OptionsContainerProps {
    title: string
    width?: number
    children?: React.ReactNode
}

export default function OptionsContainer(props: OptionsContainerProps) {

    return (
        <div style={{
            borderRadius: 10,
            background: "#1A202C",
            display: "flex",
            flexDirection: "column",
            alignItems: 'center',
            justifyContent: 'center',
            width: props.width || 500,
            padding: 25,
            flexWrap: "wrap",
            gap: 20
        }}>
            <Typography variant="h5" style={{ marginBottom: 5 }} >
                { props.title }
            </Typography>
            { props.children }
        </div>
    )
}