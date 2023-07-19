import React from "react";
import {NodeData} from "@/model/NodeData";
import {NodeTypes} from "@/model/NodeTypes";

export interface BasicNode {
    id: string
    nodeType: NodeTypes,
    data: NodeData
    run: () => React.ReactNode | void
}