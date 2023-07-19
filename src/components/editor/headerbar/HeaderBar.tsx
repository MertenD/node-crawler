import {toolbarBackgroundColor, useReactFlowStore} from "@/stores/editor/ReactFlowStore";
import React, {useRef} from "react";
import {TOOLBAR_HEIGHT} from "@/app/editor/page";
import {IconButton, Tooltip} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload'
import {loadCrawlerProject, onSave} from "@/util/IOUtil";
import {CrawlerProjectDto} from "@/model/CrawlerProjectDto";
import {useReactFlow} from "reactflow";
import PageNavigation from "@/components/editor/headerbar/PageNavigation";

export default function HeaderBar() {

    const reactFlowInstance = useReactFlow();
    const inputFile = useRef<HTMLInputElement | null>(null);

    const { nodes, edges } = useReactFlowStore();

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
            gap: 5,
            width: "33%",
        }}>
            <Tooltip title="Save Project" >
                <IconButton onClick={() => {
                    const data = {
                        nodes: nodes,
                        edges: edges
                    } as CrawlerProjectDto
                    const dataString = JSON.stringify(data, null, 2)
                    onSave("crawler-project.ncp", dataString, "saveProject")
                }}>
                    <SaveIcon />
                    <a id="saveProject" style={{ display: "none"}} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Load Project" >
                <IconButton component="label">
                    <UploadIcon />
                    <input accept={".ncp"} type='file' id='uploadCrawlerProject' ref={inputFile} hidden onChange={(event) => {
                        loadCrawlerProject(event, reactFlowInstance)
                        console.log("loaded")
                    }}/>
                </IconButton>
            </Tooltip>
        </div>
        <div>
            <PageNavigation />
        </div>
        <div style={{
            width: "33%"
        }}>

        </div>
    </div>
}