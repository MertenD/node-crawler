import {NextNodeKey} from "@/model/NextNodeKey";
import {BasicNode} from "@/engine/nodes/BasicNode";

export type NodeMap = Map<NodeMapKey, NodeMapValue>
export type NodeMapKey = string // Id of flow element
export type NodeMapValue = { node: BasicNode, next: NodeMapNext }
export type NodeMapNext = Record<NextNodeKey, {nodeId: NodeMapKey, targetHandleId: string}[]> | null