import {ConnectionRule} from "@/config/ConnectionRules";

export interface NodeData {
}

export interface DynamicNodeData extends NodeData {
    connectionRule?: ConnectionRule
}