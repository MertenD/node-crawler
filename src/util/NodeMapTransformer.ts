/**
 * Gibt eine Liste mit folgenden Elementen zurück:
 *
 * key: uuid des nodes
 * value: {
 *   node: node
 *   next: uuids der nächsten nodes
 * }
 */
import {Edge, Node} from "reactflow";
import {NodeMapKey, NodeMapValue} from "@/model/NodeMap";
import {NodeType} from "@/config/NodeType.ts";
import {NextNodeKey} from "@/model/NextNodeKey";
import {NodeData} from "@/model/NodeData";
import {BasicNode} from "@/engine/nodes/BasicNode";
import {nodesMetadataMap} from "@/config/NodesMetadata";

export function getNodeMap(nodes: Node[], edges: Edge[]): Map<NodeMapKey, NodeMapValue> {

    const nodeMap = new Map<NodeMapKey, NodeMapValue>()

    nodes.forEach((node: Node) => {
        const { id, type, data } = node
        const basicNode = getNodeFromType(type as NodeType, id, data)
        if (basicNode === null) {
            return
        }
        nodeMap.set(id, {
            node: basicNode,
            next: edges.filter((edge: Edge) => edge.source === id).reduce<Record<NextNodeKey, {nodeId: NodeMapKey, targetHandleId: string}[]>>((accumulator, edge: Edge) => {
                // sourceHandle is "True" or "False" when dealing with gateway nodes

                const newAccumulatorValue = {nodeId: edge.target, targetHandleId: edge.targetHandle} as {nodeId: NodeMapKey, targetHandleId: string}

                if (type === NodeType.GATEWAY_NODE && edge.sourceHandle !== null) {
                    if (edge.sourceHandle === "True") {
                        accumulator[NextNodeKey.TRUE] = [...accumulator[NextNodeKey.TRUE], newAccumulatorValue]
                    } else {
                        accumulator[NextNodeKey.FALSE] = [...accumulator[NextNodeKey.FALSE], newAccumulatorValue]
                    }
                } else {
                    accumulator[NextNodeKey.ALWAYS] = [...accumulator[NextNodeKey.ALWAYS], newAccumulatorValue]
                }
                return accumulator
            }, {
                [NextNodeKey.TRUE]: [],
                [NextNodeKey.FALSE]: [],
                [NextNodeKey.ALWAYS]: []
            } as Record<NextNodeKey, {nodeId: NodeMapKey, targetHandleId: string}[]>) || null
        })
    })

    return nodeMap
}

function getNodeFromType(type: NodeType, id: string, data: NodeData): BasicNode | null {

    return nodesMetadataMap[type]?.getEngineNode(id, data) || null
}