import {useReactFlowStore} from "@/stores/editor/ReactFlowStore";
import React, {useRef} from "react";
import {IconButton, Tooltip} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload'
import {loadCrawlerProject, onSave} from "@/util/IOUtil";
import {CrawlerProjectDto} from "@/model/CrawlerProjectDto";
import {useReactFlow} from "reactflow";
import PageNavigation from "@/components/editor/headerbar/PageNavigation";
import HomeIcon from '@mui/icons-material/Home';
import Link from "next/link";
import {usePlayStore} from "@/stores/editor/PlayStore";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import {disabledColor, toolbarBackgroundColor} from "@/config/colors";

export const TOOLBAR_HEIGHT = 8
export const CANVAS_HEIGHT = 100 - TOOLBAR_HEIGHT

export default function HeaderBar() {

    // TODO Ich will einen Schritt für Schritt Debug mode, in dem bei jedem Schritt die Inputs und Outputs angezeigt werden, wöhrend man
    // beim aktuellen Knoten die Möglichkeit hat die Optionen anzupassen
    // + Live Preview des vorläugfigen Ergebnis was rauskomen würde

    const reactFlowInstance = useReactFlow();
    const inputFile = useRef<HTMLInputElement | null>(null);

    const { nodes, edges } = useReactFlowStore();
    const setup = usePlayStore(state => state.setup)
    const stop = usePlayStore(state => state.stop)
    const isProcessRunning = usePlayStore(state => state.isProcessRunning)
    const isConnectionHighlightingActivated = useReactFlowStore(state => state.isConnectionHighlightingActivated)
    const setIsConnectionHighlightingActivated = useReactFlowStore(state => state.setIsConnectionHighlightingActivated)
    const { isStepByStep, setIsStepByStep, isNextStepReady, executeNextStep } = usePlayStore()

    return <div style={{
        height: `${TOOLBAR_HEIGHT}vh`,
        minHeight: 75,
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
            alignItems: "center",
            gap: 5,
            width: "33%",
        }}>
            <Tooltip title="Back to Homepage" >
                <Link href="/" passHref>
                    <IconButton>
                        <HomeIcon />
                    </IconButton>
                </Link>
            </Tooltip>
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
                    }}/>
                </IconButton>
            </Tooltip>
            <div style={{ height: 30, marginLeft: 5, marginRight: 5, width: 2, borderRadius: 10, backgroundColor: disabledColor }} />
            <Tooltip title="Run crawler" >
                <IconButton disabled={isProcessRunning} onClick={() =>{
                    setup()
                }}>
                    <PlayArrowIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={isStepByStep ? "Next step" : "Run step by step"} >
                <IconButton disabled={!isNextStepReady && isStepByStep} onClick={() => {
                    if (!isStepByStep) {
                        setIsStepByStep(true)
                        setup()
                    } else {
                        executeNextStep()
                    }
                }}>
                    <SkipNextIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Stop crawler" >
                <IconButton disabled={!isProcessRunning} onClick={() =>{
                    usePlayStore.getState().writeToLog("Crawler was stopped manually")
                    stop()
                }}>
                    <StopIcon />
                </IconButton>
            </Tooltip>
            <div style={{ height: 30, marginLeft: 5, marginRight: 5, width: 2, borderRadius: 10, backgroundColor: disabledColor }} />
            <Tooltip title={isConnectionHighlightingActivated ? "Turn off connection highlighting" : "Turn on connection highlighting"} >
                <IconButton onClick={() =>{
                    setIsConnectionHighlightingActivated(!isConnectionHighlightingActivated)
                }}>
                    { isConnectionHighlightingActivated ? <VisibilityOffIcon /> : <VisibilityIcon /> }
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