import {createEdge} from "@/components/editor/pages/canvas/edges/util/EdgeCreators";
import {EdgeProps} from "reactflow";
import React from "react";
import {OutputValueType} from "@/config/OutputValueType";
import './EdgeGradientStyles.css'
import {defaultEdgeColor, selectedColor} from "@/config/colors";

export const DefaultEdge = createEdge(defaultEdgeColor, defaultEdgeColor, "default")
export const SelectedIncomingEdge = createEdge(defaultEdgeColor, selectedColor, "incoming")
export const SelectedOutgoingEdge = createEdge(selectedColor, defaultEdgeColor, "outgoing")
export const BothSelectedEdge = createEdge(selectedColor, selectedColor, "bothSelected")
export const EdgeSelectedEdge = createEdge(selectedColor, selectedColor, "edgeSelected")

export const highlightEdges: HighlightEdgeInfoTypes = {
    [OutputValueType.NONE]: createEdge(defaultEdgeColor, defaultEdgeColor, OutputValueType.NONE),
    [OutputValueType.TEXT]: createEdge("#7CFC00", "#7CFC00", OutputValueType.TEXT),
    [OutputValueType.JSON]: createEdge("#87CEEB", "#87CEEB", OutputValueType.JSON),
    [OutputValueType.HTML]: createEdge("#FF00FF", "#FF00FF", OutputValueType.HTML)
}

type HighlightEdgeInfoTypes = {
    [K in OutputValueType]: EdgeType
}

export type EdgeType = ({id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd}: EdgeProps) => React.ReactNode | null
