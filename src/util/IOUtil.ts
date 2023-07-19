import {ReactFlowInstance} from "reactflow";
import {CrawlerProjectDto} from "@/model/CrawlerProjectDto";
import {v4 as uuidv4} from 'uuid';
import {Node, Edge} from "reactflow";

export function onSave(fileName: string, content: string, anchorElementName: string) {
    const downloadableContent = "data:text/json;charset=utf-8," + encodeURIComponent(content)
    const anchorElement = document.getElementById(anchorElementName);
    if (anchorElement !== null) {
        anchorElement.setAttribute("href", downloadableContent);
        anchorElement.setAttribute("download", fileName);
        anchorElement.click();
    }
}

export function loadCrawlerProject(changeEvent: any, reactFlowInstance: ReactFlowInstance) {
    const fileReader = new FileReader();
    fileReader.readAsText(changeEvent.target.files[0], "UTF-8");
    fileReader.onload = progressEvent => {
        if (progressEvent.target !== null) {
            const bpmnDto = JSON.parse(String(progressEvent.target.result)) as CrawlerProjectDto

            // This whole process changes the id's of the nodes and adapts the edges as well to that change.
            // This is necessary so that the loaded nodes will be re-rendered and the loaded data is loaded into the node components
            const newIdPairs = bpmnDto.nodes.reduce((accumulator: Record<string, string>, node) => {
                accumulator[node.id] = uuidv4()
                return accumulator;
            }, {});
            const newNodes = bpmnDto.nodes.map((node: Node) => {
                return { ...node, id: newIdPairs[node.id], parentNode: node.parentNode !== undefined ? newIdPairs[node.parentNode] : undefined }
            })
            const newEdges = bpmnDto.edges.map((edge: Edge) => {
                return { ...edge, source: newIdPairs[edge.source], target: newIdPairs[edge.target]}
            })

            console.log(newNodes, newEdges)

            reactFlowInstance.setNodes(newNodes)
            reactFlowInstance.setEdges(newEdges)
        }
    };
}