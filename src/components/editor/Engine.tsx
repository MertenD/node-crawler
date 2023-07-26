import React, { useState, useEffect } from "react";
import { usePlayStore } from "@/stores/editor/PlayStore";

export default function Engine() {

    const [nodeContent, setNodeContent] = useState<React.ReactNode | null | void>(null);
    const currentNode = usePlayStore((state) => state.currentNode);
    const isProcessRunning = usePlayStore(state => state.isProcessRunning)

    useEffect(() => {
        const runCurrentNode = async () => {
            if (currentNode !== null) {
                const content = await currentNode.node.run();
                setNodeContent(content);
            }
        };

        if (isProcessRunning) {
            // noinspection JSIgnoredPromiseFromCall
            runCurrentNode();
        }
    }, [currentNode]);

    return <div>{nodeContent || <></>}</div>;
}