import useReactFlowStore from "@/stores/ReactFlowStore";
import React, {useEffect, useState} from "react";
import {NodeTypes} from "@/model/NodeTypes";
import {FetchWebsiteOptions} from "@/app/canvas/nodes/FetchWebsiteNode";

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
        switch(currentNode.type) {
            case NodeTypes.FETCH_WEBSITE_NODE:
                setOptions(<FetchWebsiteOptions  id={currentNode.id} />)
                break
        }
    }, [currentNode])

    return (
        <div style={{
            borderRadius: 10,
            background: "#1A202C",
            display: "flex",
            flexDirection: "column",
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            { options }
        </div>
    )
}