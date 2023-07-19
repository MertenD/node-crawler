import Engine from "@/components/editor/pages/play/Engine";
import {Button} from "@mui/material";
import {usePlayStore} from "@/stores/editor/PlayStore";

export default function PlayPage() {

    return <div>
        <Button variant="contained" onClick={() => {
            console.log("Setup Process")
            usePlayStore.getState().setup()
        }}> 
            Start Process
        </Button>
        <Engine />
    </div>
}