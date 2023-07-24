import {usePlayStore} from "@/stores/editor/PlayStore";
import React, {useEffect, useRef} from "react";
import {toolbarBackgroundColor} from "@/stores/editor/ReactFlowStore";
import {IconButton, Tooltip, Typography} from "@mui/material";
import {onSave} from "@/util/IOUtil";
import SaveIcon from "@mui/icons-material/Save";

export default function Files() {

    const files = usePlayStore(state => state.files)

    const filesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (filesRef.current) {
            smoothScrollToBottom(filesRef.current, filesRef.current?.scrollHeight, 300);
        }
    }, [files])

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
        width: 500,
        height: "100%",
        backgroundColor: toolbarBackgroundColor,
        borderRadius: 10
    }}>
        <Typography variant={"h5"} style={{ margin: 20 }}>
            Created Files
        </Typography>
        <div ref={filesRef} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "left",
            paddingLeft: 20,
            paddingRight: 20,
            overflowY: "auto",
            width: "100%",
            gap: 10,
        }}>
            { files.map(({name, extension, content}, index) =>
                <div key={"filesdiv" + index} style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 10
                }}>
                    <Tooltip title={`Download ${name}.${extension || "txt"}`} >
                        <IconButton onClick={() => {
                            onSave(`${name}.${extension || "txt"}`, content, `downloadFile-${name}`)
                        }}>
                            <SaveIcon />
                            <a id={`downloadFile-${name}`} style={{ display: "none"}} />
                        </IconButton>
                    </Tooltip>
                    <Typography key={"files" + index} variant="body1" style={{ wordWrap: "break-word" }}>
                        { name }.{ extension || "txt" }
                    </Typography>
                </div>
            ) }
        </div>
    </div>
}