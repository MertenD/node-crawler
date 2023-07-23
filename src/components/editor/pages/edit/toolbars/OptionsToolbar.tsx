import React, {useEffect, useState} from "react";
import {useReactFlowStore} from "@/stores/editor/ReactFlowStore";
import {Node,} from 'reactflow';
import getNodesInformation from "@/components/editor/pages/edit/nodes/util/NodesInformation";
import {usePlayStore} from "@/stores/editor/PlayStore";
import Log from "@/components/editor/pages/play/Log";
import OptionsContainer from "@/components/form/OptionsContainer";

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

        setOptions(
            getNodesInformation(currentNode.id)
                .find(info => info.type === currentNode.type)
                .options
        )
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