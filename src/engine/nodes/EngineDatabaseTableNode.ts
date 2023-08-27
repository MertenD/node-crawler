import {BasicNode} from "@/engine/nodes/BasicNode";
import {NodeType} from "@/config/NodeType";
import {usePlayStore} from "@/stores/editor/PlayStore";
import {DatabaseTableNodeData} from "@/components/editor/pages/canvas/nodes/DatabaseTableNode";
import {DatabaseOutput, Output} from "@/config/OutputValueType";

export class EngineDatabaseTableNode implements BasicNode {
    id: string;
    nodeType: NodeType
    data: DatabaseTableNodeData

    constructor(id: string, data: DatabaseTableNodeData) {
        this.id = id
        this.nodeType = NodeType.DATABASE_TABLE_NODE
        this.data = data
    }

    async run() {

        const inputs = usePlayStore.getState().getInputForAllHandles(this.id)

        if (inputs) {

            const createTableStatement = generateSQLCreateTable(inputs, this.data.tableName)
            const insertStatement = generateSQLInsert(inputs, this.data.tableName)

            usePlayStore.getState().addOutgoingPipelines(this.id, {
                value: {
                    schema: createTableStatement,
                    content: insertStatement
                }
            } as DatabaseOutput)

            setTimeout(() => {
                usePlayStore.getState().nextNode()
            }, 200);
        }
    }
}

const generateSQLCreateTable = (data: Record<string, Output[] | Output[][]>, tableName: string): string => {
    return `CREATE TABLE ${tableName} (${Object.keys(data).map(key => `${key} TEXT`).join(", ")});`
}

const generateSQLInsert = (data: Record<string, Output[] | Output[][]>, tableName: string): string => {
    const keys = Object.keys(data);
    const length = data[keys[0]].length;
    const valuesWithBrackets: string[] = [];

    for (let i = 0; i < length; i++) {
        const values = keys.map(key => {
            return `'${(data[key][i] as Output).value.replace("'", "")}'`;
        }).join(", ");

        const valueWithBrackets = `(${values})`;
        valuesWithBrackets.push(valueWithBrackets);
    }

    return `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES ${valuesWithBrackets.join(", ")};`
};