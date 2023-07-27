import React from 'react';
import {EdgeProps, getSmoothStepPath} from 'reactflow';
import {defaultEdgeColor} from "@/app/layout";

export default function DefaultEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}: EdgeProps) {

    const xEqual = sourceX === targetX;
    const yEqual = sourceY === targetY;

    const [edgePath] = getSmoothStepPath({
        sourceX: xEqual ? sourceX + 0.0001 : sourceX,
        sourceY: yEqual ? sourceY + 0.0001 : sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <g className={`react-flow__edge default`}>
            <defs>
                <linearGradient id="default-edge-gradient">
                    <stop offset="0%" stopColor={defaultEdgeColor} />
                    <stop offset="100%" stopColor={defaultEdgeColor} />
                </linearGradient>
                <marker id="default-arrow" markerWidth="15" markerHeight="15" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill={defaultEdgeColor} />
                </marker>
            </defs>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                stroke="url(#default-edge-gradient)"
                strokeWidth={2}
                markerEnd="url(#default-arrow)"
            />
        </g>
    );
}