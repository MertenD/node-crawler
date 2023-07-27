import React, {useState} from "react"
import {IconButton, OutlinedInputProps, TextField, Tooltip} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {openSuccessSnackBar} from "@/stores/editor/EditorPageStore";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';

export interface CacheTextFieldProps {
    label: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    inputProps?: Partial<OutlinedInputProps>
}

export default function CacheTextField(props: CacheTextFieldProps) {

    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            gap: 5
        }}>
            <TextField
                fullWidth
                label={props.label}
                variant="outlined"
                value={(isExpanded ? props.value.trim() : props.value.trim().substring(0, 90) + "...") || ""}
                onChange={props.onChange}
                InputProps={props.inputProps || {}}
                disabled={!isExpanded}
                multiline
                maxRows={isExpanded ? 10 : 2}
            />
            <div style={{
                display: "flex",
                flexDirection: "column"
            }}>
                <Tooltip title={isExpanded ? "Collapse cache" : "Expand cache"} >
                    <IconButton onClick={() => { setIsExpanded(!isExpanded) }}>
                        { isExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon /> }
                    </IconButton>
                </Tooltip>
                <Tooltip title="Copy cache" >
                    <IconButton onClick={() =>{
                        navigator.clipboard.writeText(props.value).then(() => {
                            openSuccessSnackBar("Cache copied to clipboard")
                        })
                    }}>
                        <ContentCopyIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}