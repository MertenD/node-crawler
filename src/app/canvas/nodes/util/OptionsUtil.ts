import {Node} from "reactflow";
import React from "react";

export function updateLocalNodeDataValue(
    setNode: React.Dispatch<React.SetStateAction<Node | null>>,
    key: string,
    value: string
): void {
    setNode((oldNode) => {
        if (oldNode === null) {
            return null
        }
        return {
            ...oldNode,
            data: {
                ...oldNode.data,
                [key]: value
            }
        }
    })
}
