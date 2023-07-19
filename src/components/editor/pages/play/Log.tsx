import {usePlayStore} from "@/stores/editor/PlayStore";
import {Typography} from "@mui/material";
import {defaultEdgeColor, toolbarBackgroundColor} from "@/stores/editor/ReactFlowStore";
import {useEffect, useRef} from "react";

export default function Log() {

    const log = usePlayStore(state => state.log)

    const logRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (logRef.current) {
            smoothScrollToBottom(logRef.current, logRef.current?.scrollHeight, 300);
        }
    }, [log])

    function smoothScrollToBottom(element: HTMLDivElement | null, target: number | undefined, duration: number) {
        if (element !== null) {
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

    return <div ref={logRef} style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "left",
        backgroundColor: toolbarBackgroundColor,
        borderRadius: 10,
        padding: 20,
        overflowY: "auto",
        height: "100%",
        width: "100%",
        gap: 10,
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
}