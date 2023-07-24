import React, { useState, useEffect } from "react";
import { usePlayStore } from "@/stores/editor/PlayStore";

export default function Engine() {

    const [nodeContent, setNodeContent] = useState<React.ReactNode | null>(null);
    const currentNode = usePlayStore((state) => state.currentNode);
    const isProcessRunning = usePlayStore(state => state.isProcessRunning)

    useEffect(() => {
        const runCurrentNode = async () => {
            if (currentNode !== null) {
                const content = await currentNode.node.run();
                if (content !== undefined) {
                    setNodeContent(content);
                } else {
                    // You could set a default value here if you want
                    setNodeContent(null);
                }
            }
        };

        if (isProcessRunning) {
            runCurrentNode();
        }
    }, [currentNode]);

    return <div>{nodeContent || <></>}</div>;
}