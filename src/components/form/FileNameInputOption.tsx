import React from "react"
import {OutlinedInputProps, TextField} from "@mui/material";

export interface FileNameInputOptionProps {
    fileName: string | undefined | null,
    onFileNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    extension: string | undefined | null,
    onExtensionChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    inputProps?: Partial<OutlinedInputProps>
}

export default function FileNameInputOption(props: FileNameInputOptionProps) {

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%"
        }}>
            <TextField
                fullWidth
                label={"Filename"}
                variant="outlined"
                value={props.fileName || ""}
                onChange={props.onFileNameChange}
                InputProps={props.inputProps || {}}
                style={{
                    width: "70%"
                }}
            />
            <TextField
                fullWidth
                label={"Extension"}
                variant="outlined"
                value={props.extension || ""}
                onChange={props.onExtensionChange}
                InputProps={props.inputProps || {}}
                style={{
                    width: "30%"
                }}
            />
        </div>
    )
}