import Engine from "@/components/editor/pages/play/Engine";
import {usePlayStore} from "@/stores/editor/PlayStore";
import Log from "@/components/editor/pages/play/Log";
import Files from "@/components/editor/pages/play/Files";
import LoadingButton from '@mui/lab/LoadingButton';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CancelIcon from '@mui/icons-material/Cancel';
import {Button} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";
import {onSave} from "@/util/IOUtil";

export default function PlayPage() {

    const setup = usePlayStore(state => state.setup)
    const stop = usePlayStore(state => state.stop)
    const log = usePlayStore(state => state.log)
    const isProcessRunning = usePlayStore(state => state.isProcessRunning)

    return <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 20
    }}>
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 20
        }}>
            <LoadingButton
                loadingPosition="end"
                endIcon={<PlayCircleFilledIcon />}
                loading={isProcessRunning}
                variant="contained"
                onClick={() => {
                    setup()
                }}
                sx={{
                    width: 180
                }}
            >
                { isProcessRunning ? "Running" : "Start Crawler" }
            </LoadingButton>
            <Button
                endIcon={<CancelIcon />}
                disabled={!isProcessRunning}
                variant="contained"
                onClick={() => {
                    usePlayStore.getState().writeToLog("Crawler was stopped manually")
                    stop()
                }}
            >
                Stop
            </Button>
            <Button
                endIcon={<SaveIcon />}
                disabled={isProcessRunning || log.length === 0}
                variant="contained"
                onClick={() => {
                    onSave(`log.txt`, JSON.stringify(log, null, 2), `downloadFile-log`)
                }}
            >
                <a id={`downloadFile-log`} style={{ display: "none"}} />
                Download Log
            </Button>
        </div>
        <Engine />
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 20,
            width: "100%",
            height: "95%",
            paddingTop: 20,
        }}>
            <Log />
            <Files />
        </div>
    </div>
}