// --- Data ---
import {
    createDynamicNodeComponent,
    createNodeShapeStyle,
    createOptionsComponent
} from "@/components/editor/pages/canvas/nodes/util/Creators";
import {NodeType} from "@/config/NodeType";
import React, {useEffect} from "react";
import {NodeMetadata} from "@/config/NodesMetadata";
import {DynamicNodeData, NodeData} from "@/model/NodeData";
import {EngineDatabaseTableNode} from "@/engine/nodes/EngineDatabaseTableNode";
import {Button, IconButton} from "@mui/material";
import {InputRule} from "@/config/ConnectionRules";
import {OutputValueType} from "@/config/OutputValueType";
import TextInputOption from "@/components/form/TextInputOption";
import StorageIcon from '@mui/icons-material/Storage';
import RowOptionsContainer from "@/components/form/RowOptionsContainer";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MultiSelectOption from "@/components/form/MultiSelectOption";
import useReactFlowStore from "@/stores/editor/ReactFlowStore";

export interface DatabaseTableNodeData extends DynamicNodeData {

}

// --- Style ---
export const DatabaseTableShapeStyle = createNodeShapeStyle({
    height: 70,
    width: 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
})

// --- Node ---
export const DatabaseTableNode = createDynamicNodeComponent<DynamicNodeData>(
    NodeType.DATABASE_TABLE_NODE,
    DatabaseTableShapeStyle,
    () => {
        return <div style={{
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
        }}>
            <StorageIcon />
        </div>
    }
)

// --- Options ---
export const DatabaseTableOptions = createOptionsComponent<DatabaseTableNodeData>("Database Table", ({ id, data, onDataUpdated }) => {

    const [inputs, setInputs] = React.useState<InputRule[]>(data.connectionRule ? [...data.connectionRule.inputRules] : [])

    function addInput() {
        setInputs([...inputs, {
            handleId: "",
            allowedValueTypes: [
                OutputValueType.HTML
            ],
            maxConnections: 999
        } as InputRule])
    }

    useEffect(() => {
        onDataUpdated("connectionRule", {
            ...data.connectionRule,
            inputRules: inputs,
            outputValueType: OutputValueType.NONE
        })
    }, [inputs]);

    return <>
        {
            inputs.map((input: InputRule, index: number) => {
                return <RowOptionsContainer>
                    <TextInputOption
                        key={index}
                        label={"Input Name"}
                        value={input.handleId}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const cleanedValue = event.target.value.replaceAll(" ", "-")
                            useReactFlowStore.getState().replaceEdgeAfterHandleRename(id, input.handleId, cleanedValue)
                            const newInputs = [...inputs]
                            newInputs[index].handleId = cleanedValue
                            setInputs(newInputs)
                        }}
                    />
                    <MultiSelectOption
                        values={Object.values(OutputValueType)}
                        selectedValues={input.allowedValueTypes}
                        onSelectionChanged={(newSelection: string[]) => {
                            const newInputs = [...inputs]
                            newInputs[index].allowedValueTypes = newSelection.map(selection => selection as OutputValueType)
                            setInputs(newInputs)
                        }}
                    />
                    <IconButton onClick={
                        () => {
                            const newInputs = [...inputs]
                            newInputs.splice(index, 1)
                            setInputs(newInputs)
                        }
                    } style={{ width: 40, height: 40 }} >
                        <DeleteForeverIcon />
                    </IconButton>
                </RowOptionsContainer>
            })
        }
        <Button onClick={addInput}>Add Input</Button>
    </>
})


// --- Metadata ---
export const DatabaseTableNodeMetadata = {
    title: "Database Table",
    type: NodeType.DATABASE_TABLE_NODE,
    getNodeComponent: DatabaseTableNode,
    getOptionsComponent: (id: string) => <DatabaseTableOptions id={id} />,
    style: DatabaseTableShapeStyle(true),
    icon: <StorageIcon />,
    getEngineNode: (id: string, data: NodeData) => {
        return new EngineDatabaseTableNode(id, data as DynamicNodeData)
    }
} as NodeMetadata