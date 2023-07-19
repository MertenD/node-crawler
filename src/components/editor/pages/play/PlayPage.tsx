import Engine from "@/components/editor/pages/play/Engine";
import {Button, Typography} from "@mui/material";
import {usePlayStore} from "@/stores/editor/PlayStore";
import Log from "@/components/editor/pages/play/Log";
import {toolbarBackgroundColor} from "@/stores/editor/ReactFlowStore";

export default function PlayPage() {

    return <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 20
    }}>
        <Button variant="contained" onClick={() => {
            usePlayStore.getState().setup()
        }}> 
            Start Process
        </Button>
        <Engine />
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 20,
            width: "100%",
            height: "95%",
            paddingTop: 20,
        }}>
            <Log />
            <div style={{
                width: 500,
                backgroundColor: toolbarBackgroundColor,
                borderRadius: 10
            }}>
                <Typography variant={"h5"} style={{ margin: 20 }}>
                    Files
                </Typography>
            </div>
        </div>
    </div>
}