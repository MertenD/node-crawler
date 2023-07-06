import React from "react"
import {OutlinedInputProps, TextField} from "@mui/material";

export interface TextInputOptionProps {
    label: string,
    value: string | undefined | null,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    inputProps?: Partial<OutlinedInputProps>
}

export default function TextInputOption(props: TextInputOptionProps) {

    return (
        <TextField
            fullWidth
            label={props.label}
            variant="outlined"
            value={props.value || ""}
            onChange={props.onChange}
            InputProps={props.inputProps || {}}
        />
    )
}