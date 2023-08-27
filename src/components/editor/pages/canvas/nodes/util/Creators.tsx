import {Handle, Node, NodeProps, Position, useUpdateNodeInternals} from "reactflow";
import React, {CSSProperties, useEffect, useMemo, useState} from "react";
import {handleStyle, useReactFlowStore} from "@/stores/editor/ReactFlowStore";
import {addOrUpdateDynamicRule, getInputRules, getOutputValueType} from "@/config/ConnectionRules";
import OptionsContainer from "@/components/form/OptionsContainer";
import {setNodeWithUpdatedDataValue} from "@/components/editor/pages/canvas/nodes/util/OptionsUtil";
import {usePlayStore} from "@/stores/editor/PlayStore";
import CacheTextField from "@/components/form/CacheTextField";
import {Tooltip} from "@mui/material";
import {NodeType} from "@/config/NodeType";
import {DynamicNodeData, NodeData} from "@/model/NodeData";
import {nodeBackgroundColor, nodeShadowColor, selectedColor} from "@/config/colors";
import Typography from "@mui/material/Typography";

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

export function createStaticNodeComponent<DataType>(
    nodeType: NodeType,
    shapeStyle: (isSelected: boolean) => CSSProperties,
    content: (id: string, selected: boolean, data: DataType) => React.ReactNode
) {

    return function({ id, selected, data }: NodeProps<DataType>) {

        const inputRules = getInputRules(nodeType, id)

        const currentConnectionStartNode = useReactFlowStore(state => state.currentConnectionStartNode)
        const handleHighlightedMap = useMemo(() => {
            let newMap = new Map()

            if (inputRules && currentConnectionStartNode) {
                // Find the rule for the currentConnectionStartNodeType once before the loop
                const outputValueType = getOutputValueType(currentConnectionStartNode.type as NodeType, currentConnectionStartNode.id)
                if (outputValueType) {
                    inputRules.forEach(rule => {
                        newMap.set(rule.handleId, rule.allowedValueTypes.includes(outputValueType) && currentConnectionStartNode.id !== id);
                    });
                }
            }

            return newMap;
        }, [currentConnectionStartNode]);

        return <div style={{
            ...shapeStyle(selected),
        }}>
            { getInputRules(nodeType, id).map(rule => {
                return <Tooltip title={"Allowed input values: " + rule.allowedValueTypes.join(", ")} >
                    <Handle id={rule.handleId} style={{
                        ...handleStyle(selected),
                        backgroundColor: handleHighlightedMap.get(rule.handleId) ? selectedColor : handleStyle(selected).backgroundColor
                    }} type="target" position={Position.Left} />
                </Tooltip>
            }) }
            { getOutputValueType(nodeType, id) && (
                <Tooltip title={"Output value: " + getOutputValueType(nodeType, id)} >
                    <Handle id="output" style={handleStyle(selected)} type="source" position={Position.Right}/>
                </Tooltip>
            ) }
            { content(id, selected, data) }
        </div>
    }
}

export function createDynamicNodeComponent<DataType extends DynamicNodeData>(
    nodeType: NodeType,
    shapeStyle: (isSelected: boolean) => CSSProperties,
    content: (id: string, selected: boolean, data: DataType) => React.ReactNode
) {

    return function({ id, selected, data }: NodeProps<DataType>) {

        const updateNodeInternals = useUpdateNodeInternals()

        useEffect(() => {
            if (data.connectionRule) {
                addOrUpdateDynamicRule(nodeType, id, data.connectionRule)
                useReactFlowStore.getState().removeIllegalEdgesAfterDynamicNodeChange(nodeType, id)
                updateNodeInternals(id)
            }
        }, [data.connectionRule]);

        const currentConnectionStartNode = useReactFlowStore(state => state.currentConnectionStartNode)
        const handleHighlightedMap = useMemo(() => {
            let newMap = new Map()

            if (data.connectionRule?.inputRules && currentConnectionStartNode) {
                // Find the rule for the currentConnectionStartNodeType once before the loop
                const outputValueType = getOutputValueType(currentConnectionStartNode.type as NodeType, currentConnectionStartNode.id)
                if (outputValueType) {
                    data.connectionRule.inputRules.forEach(rule => {
                        newMap.set(rule.handleId, rule.allowedValueTypes.includes(outputValueType) && currentConnectionStartNode.id !== id);
                    });
                }
            }

            return newMap;
        }, [currentConnectionStartNode]);

        return <div style={{
            ...shapeStyle(selected),
            height: Math.max(shapeStyle(selected).height as number || 0, shapeStyle(selected).minHeight as number || 0) + (data.connectionRule?.inputRules.length || 0) * 30
        }}>
            { data.connectionRule?.inputRules.map((rule, index) => {
                return <Tooltip title={"Allowed input values: " + rule.allowedValueTypes.join(", ")} >
                    <Handle id={rule.handleId} style={{
                        ...handleStyle(selected),
                        backgroundColor: handleHighlightedMap.get(rule.handleId) ? selectedColor : handleStyle(selected).backgroundColor,
                        top: Math.max(shapeStyle(selected).height as number || 0, shapeStyle(selected).minHeight as number || 0) + (index * 30),
                        zIndex: 1
                    }} type="target" position={Position.Left} />
                </Tooltip>
            }) }
            { data.connectionRule?.outputValueType && (
                <Tooltip title={"Output value: " + data.connectionRule.outputValueType} >
                    <Handle id="output" style={{
                        ...handleStyle(selected),
                        top: data.connectionRule.inputRules.length > 0 ?
                            Math.max(shapeStyle(selected).height as number || 0, shapeStyle(selected).minHeight as number || 0) + ((data.connectionRule.inputRules.length - 1) * 30) / 2
                            : undefined,
                        zIndex: 1
                    }} type="source" position={Position.Right}/>
                </Tooltip>
            ) }
            { content(id, selected, data) }
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "80%",
                position: "absolute",
                top: Math.max(shapeStyle(selected).height as number || 0, shapeStyle(selected).minHeight as number || 0) - 13,
                marginLeft: 10
            }}>
                { data.connectionRule?.inputRules.map((rule, index) => {
                    return <div style={{ height: 30 }}>
                        <Typography variant="body1">
                            {rule.handleId}
                        </Typography>
                    </div>
                }) }
            </div>
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
            if (ownOutgoingPipeline && ownOutgoingPipeline.value) {
                setCachedOutput(ownOutgoingPipeline.value.map(output => JSON.stringify(output.value)))
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

