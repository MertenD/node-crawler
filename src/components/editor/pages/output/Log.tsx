import {usePlayStore} from "@/stores/editor/PlayStore";
import {Button, Typography} from "@mui/material";
import {defaultEdgeColor, toolbarBackgroundColor} from "@/stores/editor/ReactFlowStore";
import React, {useEffect, useRef} from "react";
import SaveIcon from "@mui/icons-material/Save";
import {onSave} from "@/util/IOUtil";

export interface LogProps {
    hasPadding?: boolean
    hasTitle?: boolean
}

export default function Log(props: LogProps) {

    const log = usePlayStore(state => state.log)
    const isProcessRunning = usePlayStore(state => state.isProcessRunning)

    const logRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (logRef.current) {
            smoothScrollToBottom(logRef.current, logRef.current?.scrollHeight, 300);
        }
    }, [log])

    function smoothScrollToBottom(element: HTMLDivElement | null, target: number | undefined, duration: number) {
        if (element !== null && target !== undefined) {
            const startTime = Date.now()
            const start = element.scrollTop
            const distance = target - start

            const animationStep = () => {
                const progress = Date.now() - startTime
                const percent = Math.min(progress / duration, 1)
                const easeInOutQuad = percent < 0.5 ? 2 * percent * percent : 1 - Math.pow(-2 * percent + 2, 2) / 2
                element.scrollTop = start + distance * easeInOutQuad

                if (progress < duration) {
                    requestAnimationFrame(animationStep)
                }
            };

            requestAnimationFrame(animationStep)
        }
    }

    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: toolbarBackgroundColor,
        borderRadius: 10,
        height: "100%",
        width: "100%",
        padding: props.hasPadding === undefined || props.hasPadding ? 20 : 0,
        overflowY: "hidden"
    }}>
        { (props.hasTitle === undefined || props.hasTitle) && <Typography variant={"h5"} style={{ marginBottom: 30 }}>
            Log
        </Typography> }
        <div ref={logRef} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "left",
            overflowY: "auto",
            gap: 10,
            marginBottom: 20
        }}>
            { log.map((message: string, index) =>
                <Typography key={"log" + index} variant="body1" style={{ wordWrap: "break-word" }}>
                    <span style={{ fontWeight: "bold", color: defaultEdgeColor }}>
                        { message.substring(0, 19) }:
                    </span>
                    { message.substring(20) }
                </Typography>
            ) }
        </div>
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
}