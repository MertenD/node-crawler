import React from "react"
import {OutlinedInputProps, TextField} from "@mui/material";

export interface CacheTextFieldProps {
    label: string,
    value: string | undefined | null,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    inputProps?: Partial<OutlinedInputProps>
}

export default function CacheTextField(props: CacheTextFieldProps) {

    return (
        <TextField
            fullWidth
            label={props.label}
            variant="outlined"
            value={props.value || ""}
            onChange={props.onChange}
            InputProps={props.inputProps || {}}
            disabled={true}
            multiline
            maxRows={7}
        />
    )
}