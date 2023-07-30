import React from "react";
import {NodeData} from "@/model/NodeData";
import {NodeType} from "@/config/NodeType";

export interface BasicNode {
    id: string
    nodeType: NodeType,
    data: NodeData
    run: () => Promise<React.ReactNode> | Promise<void>
}