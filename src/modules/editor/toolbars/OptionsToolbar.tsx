import useReactFlowStore from "@/stores/ReactFlowStore";
import React, {useEffect, useState} from "react";
import getNodesInformation from "@/modules/editor/toolbars/util/NodesInformation";

export default function OptionsToolbar() {

    const selectedNodes = useReactFlowStore((state) => state.selectedNodes)
    const [options, setOptions] = useState<React.ReactNode>(<></>)
    const [currentNode, setCurrentNode] = useState(null)

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