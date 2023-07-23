import {NodeType} from "@/config/NodeType";
import {Handle, Node, NodeProps, Position} from "reactflow";
import React, {CSSProperties, useEffect, useState} from "react";
import {
    handleStyle,
    nodeBackgroundColor,
    nodeShadowColor,
    selectedColor,
    useReactFlowStore
} from "@/stores/editor/ReactFlowStore";
import {connectionRules} from "@/config/ConnectionRules";
import OptionsContainer from "@/components/form/OptionsContainer";
import {SaveNodeData} from "@/components/editor/pages/canvas/nodes/SaveNode";
import {setNodeWithUpdatedDataValue} from "@/components/editor/pages/canvas/nodes/util/OptionsUtil";

export const createNodeShapeStyle = (additionalCSS: CSSProperties = {}): (selected: boolean) => CSSProperties => {
    return function(selected) {
        return {
            minWidth: 60,
            minHeight: 60,
            backgroundColor: nodeBackgroundColor,
            borderRadius: 6,
            border: "2px solid",
            borderColor: selected ? selectedColor : nodeBackgroundColor,
            boxShadow: selected ? `0px 0px 5px 1px ${selectedColor}` : `0px 0px 3px 2px ${nodeShadowColor}`,
            ...additionalCSS
        } as CSSProperties
    }
}

export function createNodeComponent<DataType>(
    nodeType: NodeType,
    shapeStyle: (isSelected: boolean) => CSSProperties,
    content: (id: string, selected: boolean, data: DataType) => React.ReactNode
) {
    return function({ id, selected, data }: NodeProps<DataType>) {
        return <div style={{
            ...shapeStyle(selected),
        }}>
            { connectionRules.find(rule => rule.nodeType === nodeType)?.inputRules.map(rule => {
                return <Handle id={rule.handleId} style={handleStyle(selected)} type="target" position={Position.Left} />
            }) }
            <Handle id="output" style={handleStyle(selected)} type="source" position={Position.Right}/>
            { content(id, selected, data) }
        </div>
    }
}

export function createOptionsComponent<DataType>(
    optionsTitle: string,
    Options: React.ComponentType<{ id: string, data: DataType, onDataUpdated: (attributeName: keyof DataType, newValue: any) => void }>
) {
    return function(props: { id: string }) {
        const updateNodeData = useReactFlowStore((state) => state.updateNodeData)
        const getNodeById = useReactFlowStore((state) => state.getNodeById)

        const [localNode, setLocalNode] = useState<Node | null>(null)

        useEffect(() => {
            const currentNode = getNodeById(props.id);
            setLocalNode(currentNode);
        }, [props.id, getNodeById])

        useEffect(() => {
            if (localNode !== null) {
                updateNodeData(props.id, localNode.data as SaveNodeData)
            }
        }, [localNode, updateNodeData])

        return localNode !== null && <OptionsContainer title={optionsTitle}>
            <Options
                id={props.id}
                data={localNode.data}
                onDataUpdated={(attributeName, newValue) => {
                    setNodeWithUpdatedDataValue(setLocalNode, attributeName, newValue)
                }}
            />
        </OptionsContainer>
    }
}