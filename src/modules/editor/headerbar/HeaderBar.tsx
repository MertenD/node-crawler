import ReactFlowStore, {toolbarBackgroundColor} from "@/stores/ReactFlowStore";
import React, {useRef} from "react";
import {TOOLBAR_HEIGHT} from "@/app/editor/page";
import {IconButton, Tooltip} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload'
import {loadCrawlerProject, onSave} from "@/util/IOUtil";
import {CrawlerProjectDto} from "@/model/CrawlerProjectDto";
import {useReactFlow} from "reactflow";

export default function HeaderBar() {

    const reactFlowInstance = useReactFlow();
    const inputFile = useRef<HTMLInputElement | null>(null);

    return <div style={{
        height: `${TOOLBAR_HEIGHT}vh`,
        width: "100%",
        backgroundColor: toolbarBackgroundColor,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20
    }} >
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 5
        }}>
            <Tooltip title="Save Project" >
                <IconButton onClick={(event) => {
                    const data = {
                        nodes: ReactFlowStore.getState().nodes,
                        edges: ReactFlowStore.getState().edges
                    } as CrawlerProjectDto
                    onSave("crawler-project.json", data, "saveProject")
                }}>
                    <SaveIcon />
                    <a id="saveProject" style={{ display: "none"}} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Load Project" >
                <IconButton component="label">
                    <UploadIcon />
                    <input accept={".json"} type='file' id='uploadCrawlerProject' ref={inputFile} hidden onChange={(event) => {
                        loadCrawlerProject(event, reactFlowInstance)
                        console.log("loaded")
                    }}/>
                </IconButton>
            </Tooltip>
        </div>
        <div>

        </div>
        <div>

        </div>
    </div>
}