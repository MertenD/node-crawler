import {Handle, Node, NodeProps, Position} from "reactflow";
import React, {CSSProperties, useEffect, useMemo, useState} from "react";
import {handleStyle, useReactFlowStore} from "@/stores/editor/ReactFlowStore";
import {connectionRules} from "@/config/ConnectionRules";
import OptionsContainer from "@/components/form/OptionsContainer";
import {setNodeWithUpdatedDataValue} from "@/components/editor/pages/canvas/nodes/util/OptionsUtil";
import {usePlayStore} from "@/stores/editor/PlayStore";
import CacheTextField from "@/components/form/CacheTextField";
import {Tooltip} from "@mui/material";
import {NodeType} from "@/config/NodeType";
import {NodeData} from "@/model/NodeData";
import {nodeBackgroundColor, nodeShadowColor, selectedColor} from "@/config/colors";

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

    const inputRules = connectionRules.get(nodeType)?.inputRules

    return function({ id, selected, data }: NodeProps<DataType>) {

        const currentConnectionStartNodeType = useReactFlowStore(state => state.currentConnectionStartNodeType)
        const handleHighlightedMap = useMemo(() => {
            let newMap = new Map()

            if (inputRules && currentConnectionStartNodeType) {
                // Find the rule for the currentConnectionStartNodeType once before the loop
                const outputValueType = connectionRules.get(currentConnectionStartNodeType)?.outputValueType;
                if (outputValueType) {
                    inputRules.forEach(rule => {
                        newMap.set(rule.handleId, rule.allowedValueTypes.includes(outputValueType));
                    });
                }
            }

            return newMap;
        }, [currentConnectionStartNodeType]);

        return <div style={{
            ...shapeStyle(selected),
        }}>
            { connectionRules.get(nodeType)?.inputRules.map(rule => {
                return <Tooltip title={"Allowed input values: " + rule.allowedValueTypes.join(", ")} >
                    <Handle id={rule.handleId} style={{
                        ...handleStyle(selected),
                        backgroundColor: handleHighlightedMap.get(rule.handleId) ? selectedColor : handleStyle(selected).backgroundColor
                    }} type="target" position={Position.Left} />
                </Tooltip>
            }) }
            { connectionRules.get(nodeType)?.outputValueType && (
                <Tooltip title={"Output value: " + connectionRules.get(nodeType)?.outputValueType} >
                    <Handle id="output" style={handleStyle(selected)} type="source" position={Position.Right}/>
                </Tooltip>
            ) }
            { content(id, selected, data) }
        </div>
    }
}

export function createOptionsComponent<DataType extends NodeData>(
    optionsTitle: string,
    Options: React.ComponentType<{ id: string, data: DataType, onDataUpdated: (attributeName: keyof DataType, newValue: any) => void }>
) {
    return function(props: { id: string }) {
        const updateNodeData = useReactFlowStore((state) => state.updateNodeData)
        const getNodeById = useReactFlowStore((state) => state.getNodeById)

        const pipelines = usePlayStore(state => state.pipelines)
        const [cachedOutput, setCachedOutput] = useState<any | null>(null)

        useEffect(() => {
            const ownOutgoingPipeline = pipelines.find(pipeline => pipeline.from === props.id)
            if (ownOutgoingPipeline) {
                setCachedOutput(ownOutgoingPipeline.value)
            } else {
                setCachedOutput(null)
            }
        }, [pipelines])

        const [localNode, setLocalNode] = useState<Node | null>(null)

        useEffect(() => {
            const currentNode = getNodeById(props.id);
            setLocalNode(currentNode);
        }, [props.id, getNodeById])

        useEffect(() => {
            if (localNode !== null) {
                updateNodeData(props.id, localNode.data as DataType)

                // Change node data inside of node in nodemap when process is running
                // Allows to edit node options while the process runs
                if (usePlayStore.getState().isProcessRunning) {
                    const newNode = usePlayStore.getState().nodeMap.get(props.id)
                    if (newNode) {
                        newNode.node.data = localNode.data as DataType
                        usePlayStore.getState().nodeMap.set(props.id, newNode)
                    }
                }
            }
        }, [localNode, updateNodeData])

        return localNode !== null && <OptionsContainer title={optionsTitle} nodeId={props.id}>
            <Options
                id={props.id}
                data={localNode.data}
                onDataUpdated={(attributeName, newValue) => {
                    if(typeof attributeName === "string") {
                        setNodeWithUpdatedDataValue(setLocalNode, attributeName, newValue)
                    }
                }}
            />
            { cachedOutput !== null &&
                <CacheTextField
                    label={"Cached Output"}
                    value={cachedOutput}
                    onChange={() => console.log("Change")}
                />
            }
        </OptionsContainer>
    }
}

