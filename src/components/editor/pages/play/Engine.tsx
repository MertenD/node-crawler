import {usePlayStore} from "@/stores/editor/PlayStore";

export default function Engine() {

    const currentNode = usePlayStore(state => state.currentNode)

    return <div>
        { currentNode !== null && (
            currentNode.node.run() || <></>
        ) }
    </div>
}