import {SelectableHtmlPreview} from "@/components/editor/pages/html/SelectableHtmlPreview";
import {IconButton, TextField, ToggleButton, ToggleButtonGroup, Tooltip} from "@mui/material";
import React, {useState} from "react";
import {openSuccessSnackBar, openWarningSnackBar} from "@/stores/editor/EditorPageStore";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import ClearIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useHtmlSelectorStore from "@/stores/editor/HtmlSelectorStore";

export enum SelectorSelectionModes {
    ADD_TO_SELECTION = "Add to selection",
    EXCLUDE_FROM_SELECTION = "Exclude from selection",
}

export default function HtmlSelectorPage() {

    const { url, setUrl, setHtml, cssSelector } = useHtmlSelectorStore()
    const [selectionMode, setSelectionMode] = useState(SelectorSelectionModes.ADD_TO_SELECTION)

    const fetchWebsite = async (url: string) => {
        await fetch('/api/fetch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Response code was: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                setHtml(data)
            })
            .catch(error => {
                console.log(error)
                openWarningSnackBar("Website couldn't be loaded")
            });
    }

    return <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "100%",
        height: "100%",
        padding: 20,
        alignItems: "center"
    }}>
        <div style={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
            width: "100%",
            gap: 20
        }}>
            <div style={{
                height: "100%",
                width: "100%",
                overflowY: "auto",
            }}>
                <SelectableHtmlPreview
                    selectionMode={selectionMode as SelectorSelectionModes}
                />
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 20
            }}>
                <TextField
                    fullWidth
                    label={"Fetch website"}
                    variant="outlined"
                    value={url}
                    onChange={(event) => {
                        setUrl(event.target.value)
                    }}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => fetchWebsite(url)}>
                                <CloudDownloadIcon />
                            </IconButton>
                        )
                    }}
                />
                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <ToggleButtonGroup
                        value={selectionMode}
                        exclusive
                        onChange={(event, newSelectionMode) => {
                            if (newSelectionMode !== null) {
                                setSelectionMode(newSelectionMode as SelectorSelectionModes)
                            }
                        }}
                        aria-label="selection mode"
                    >
                        <ToggleButton value={SelectorSelectionModes.ADD_TO_SELECTION} aria-label="left aligned">
                            <Tooltip title={SelectorSelectionModes.ADD_TO_SELECTION}>
                                <AddIcon />
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value={SelectorSelectionModes.EXCLUDE_FROM_SELECTION} aria-label="centered">
                            <Tooltip title={SelectorSelectionModes.EXCLUDE_FROM_SELECTION}>
                                <DoDisturbIcon />
                            </Tooltip>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Tooltip title="Clear Selection" style={{ marginLeft: 10 }} >
                        <IconButton onClick={() =>{
                            console.log("Clear")
                            // TODO
                        }}>
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy CSS-Selector" style={{ marginLeft: 10 }} >
                        <IconButton onClick={() =>{
                            navigator.clipboard.writeText(cssSelector).then(() => {
                                openSuccessSnackBar("CSS-Selector copied to clipboard")
                            })
                        }}>
                            <ContentCopyIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div>
                    <Typography variant="h5">
                        Selected CSS-Selector
                    </Typography>
                    <Typography variant="body1" style={{
                        width: 500,
                        marginTop: 10
                    }}>
                        { cssSelector }
                    </Typography>
                </div>
            </div>
        </div>
    </div>
}