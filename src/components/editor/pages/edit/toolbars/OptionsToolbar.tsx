import React, {useEffect, useState} from "react";
import {useReactFlowStore} from "@/stores/editor/ReactFlowStore";
import {Node,} from 'reactflow';
import getNodesInformation from "@/components/editor/pages/edit/nodes/util/NodesInformation";

export default function OptionsToolbar() {

    const selectedNodes = useReactFlowStore((state) => state.selectedNodes)
    const [options, setOptions] = useState<React.ReactNode>(<></>)
    const [currentNode, setCurrentNode] = useState<Node | null>(null)

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
            { options }
        </>
    )
}