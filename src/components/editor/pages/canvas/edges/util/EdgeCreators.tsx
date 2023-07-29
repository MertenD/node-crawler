import React from 'react';
import {EdgeProps, getSmoothStepPath} from 'reactflow';
import "../EdgeGradientStyles.css"

export function createEdge(startColor: string, endColor: string, edgeId: string) {

    return ({
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        style = {}
    }: EdgeProps) => {

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
            <g className={`react-flow__edge ${edgeId}`}>
                <defs>
                    <linearGradient
                        id={`${edgeId}-edge-gradient`}
                        gradientUnits="userSpaceOnUse"
                        x1={sourceX}
                        y1={sourceY}
                        x2={targetX}
                        y2={targetY}
                    >
                        <stop offset="0%" stopColor={startColor} />
                        <stop offset="100%" stopColor={endColor} />
                    </linearGradient>
                    <marker id={`${edgeId}-arrow`} markerWidth="15" markerHeight="15" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill={endColor} />
                    </marker>
                </defs>
                <path
                    id={id}
                    style={style}
                    className="react-flow__edge-path"
                    d={edgePath}
                    stroke={`url(#${edgeId}-edge-gradient)`}
                    strokeWidth={2}
                    markerEnd={`url(#${edgeId}-arrow)`}
                />
            </g>
        );
    }
}