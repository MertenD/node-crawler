import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import useEditorPageState from "@/stores/editor/EditorPageStore";
import React from "react";

export default function PageNavigation() {

    const { pages, selectedPage, onPageChanged } = useEditorPageState()

    return <BottomNavigation
        showLabels
        sx={{
            backgroundColor: "transparent"
        }}
        value={selectedPage}
        onChange={(event: React.SyntheticEvent, newSelectedPage: string) => {
            console.log("Page changed", newSelectedPage)
            onPageChanged(newSelectedPage)
        }}
    >
        { Array.from(pages, ([value, page]) => {
            const {label, icon} = page;
            return <BottomNavigationAction
                label={label}
                value={value}
                icon={icon}
            />
        }) }
    </BottomNavigation>
}