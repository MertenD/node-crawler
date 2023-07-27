import React, {useEffect, useState} from "react";
import {useReactFlowStore} from "@/stores/editor/ReactFlowStore";
import {Node,} from 'reactflow';
import {usePlayStore} from "@/stores/editor/PlayStore";
import Log from "@/components/editor/pages/output/Log";
import OptionsContainer from "@/components/form/OptionsContainer";
import {nodesMetadataMap} from "@/config/NodesMetadata";

export default function OptionsToolbar() {

    const selectedNodes = useReactFlowStore((state) => state.selectedNodes)
    const [options, setOptions] = useState<React.ReactNode>(<></>)
    const [currentNode, setCurrentNode] = useState<Node | null>(null)
    const isProcessRunning = usePlayStore(state => state.isProcessRunning)

    const [isLogOpen, setIsLogOpen] = useState(false)

    useEffect(() => {
        if (isProcessRunning) {
            setIsLogOpen(true)
        }
    }, [isProcessRunning])

    useEffect(() => {
        if (selectedNodes.length === 1) {
            setCurrentNode(selectedNodes[0])
        } else {
            setCurrentNode(null)
        }
    }, [selectedNodes])

    useEffect(() => {
        if (currentNode === null) {
            setOptions(<></>)
            return
        }

        const nodeInfo = nodesMetadataMap[currentNode.type]

        if (nodeInfo) {
            setOptions(nodeInfo.getOptionsComponent(currentNode.id))
        } else {
            setOptions(<></>)
        }
    }, [currentNode])

    return (
        <>
            { !isLogOpen && options }
            { isLogOpen && <OptionsContainer title={"Log"} onClose={() => setIsLogOpen(false)}>
                <Log hasPadding={false} hasTitle={false} />
            </OptionsContainer> }
        </>
    )
}