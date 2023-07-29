import React, {useEffect, useMemo, useState} from "react";
import {useReactFlowStore} from "@/stores/editor/ReactFlowStore";
import {Node,} from 'reactflow';
import {usePlayStore} from "@/stores/editor/PlayStore";
import Log from "@/components/editor/pages/output/Log";
import OptionsContainer from "@/components/form/OptionsContainer";
import {nodesMetadataMap} from "@/config/NodesMetadata";
import {toolbarBackgroundColor} from "@/app/layout";
import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';
import DescriptionIcon from '@mui/icons-material/Description';

export default function OptionsToolbar() {

    const selectedNodes = useReactFlowStore((state) => state.selectedNodes)
    const [options, setOptions] = useState<React.ReactNode>(<></>)
    const [currentNode, setCurrentNode] = useState<Node | null>(null)
    const isProcessRunning = usePlayStore(state => state.isProcessRunning)

    const [selectedPage, setSelectedPage] = useState("options")
    const toolbarPages = useMemo(() => {
        return new Map<string, { icon?: React.ReactNode, tooltip: string }>([
            ["options", {
                icon: <TuneIcon />,
                tooltip: "Options"
            }],
            ["log", {
                icon: <DescriptionIcon />,
                tooltip: "Log"
            }]
        ])
    }, [options])

    useEffect(() => {
        if (isProcessRunning) {
            setSelectedPage("log")
        }
    }, [isProcessRunning])

    useEffect(() => {
        if (selectedNodes.length === 1) {
            setCurrentNode(selectedNodes[0])
        } else {
            setCurrentNode(null)
        }
    }, [selectedNodes])

    useEffect(() => {
        if (currentNode === null) {
            setOptions(<></>)
            return
        }

        const nodeInfo = nodesMetadataMap[currentNode.type]

        if (nodeInfo) {
            setOptions(nodeInfo.getOptionsComponent(currentNode.id))
        } else {
            setOptions(<></>)
        }
    }, [currentNode])

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 0
        }}>
            { isProcessRunning && <div style={{
                width: 200,
                height: 60,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: toolbarBackgroundColor
            }}>
                <BottomNavigation
                    showLabels
                    sx={{
                        backgroundColor: "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%"
                    }}
                    value={selectedPage}
                    onChange={(event: React.SyntheticEvent, newSelectedPage: string) => {
                        setSelectedPage(newSelectedPage)
                    }}
                >
                    { Array.from(toolbarPages, ([value, page]) => {
                        const {icon, tooltip} = page;
                        return <BottomNavigationAction
                            value={value}
                            icon={icon}
                            label={tooltip}
                        />
                    }) }
                </BottomNavigation>
            </div> }
            { selectedPage === "options" && options }
            { selectedPage === "log" && <OptionsContainer title={"Log"} onClose={() => { setSelectedPage("options") } }>
                <Log hasPadding={false} hasTitle={false} />
            </OptionsContainer> }
        </div>
    )
}