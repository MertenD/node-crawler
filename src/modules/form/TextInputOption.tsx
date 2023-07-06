import React from "react"
import {TextField} from "@mui/material";

export interface TextInputOptionProps {
    label: string,
    value?: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function TextInputOption(props: TextInputOptionProps) {

    return (
        <TextField
            fullWidth
            label={props.label}
            variant="outlined"
            value={props.value || ""}
            onChange={props.onChange}
        />
    )
}