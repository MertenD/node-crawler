import React from "react";
import DragAndDropFlow from "@/components/editor/pages/edit/DragAndDropFlow";
import create from "zustand";
import EditIcon from '@mui/icons-material/Edit';
import PlayPage from "@/components/editor/pages/play/PlayPage";
import OutputIcon from '@mui/icons-material/Output';

export type EditorPageState = {
    pages: Map<string, {label: string, child: React.ReactNode, icon?: React.ReactNode }>
    selectedPage: string
    onPageChanged: (newPage: string) => void
    getPage: (pageId: string) => {label: string, child: React.ReactNode, icon?: React.ReactNode }
    isSnackBarOpen: boolean,
    setIsSnackBarOpen: (isOpen: boolean) => void
    snackBarSeverity: string,
    setSnackBarSeverity: (severity: string) => void
    snackBarText: string,
    setSnackBarText: (text: string) => void
}

export const useEditorPageState = create<EditorPageState>((set, get) => ({
    pages: new Map<string, {label: string, child: React.ReactNode, icon?: React.ReactNode }>([
        ["edit", {
            label: "Canvas",
            child: <DragAndDropFlow />,
            icon: <EditIcon />
        }],
        ["play", {
            label: "Output",
            child: <PlayPage />,
            icon: <OutputIcon />
        }]
    ]),
    selectedPage: "edit",
    onPageChanged: (newPage: string) => {
        set({
            selectedPage: newPage
        })
        /*if (usePlayStore.getState().isProcessRunning) {
            usePlayStore.getState().writeToLog("Stopped crawler due to a page switch")
        }
        usePlayStore.getState().stop()*/
    },
    getPage: (pageId: string) => {
        return get().pages.get(pageId)
    },
    isSnackBarOpen: false,
    setIsSnackBarOpen: (isOpen: boolean) => {
        set({
            isSnackBarOpen: isOpen
        })
    },
    snackBarSeverity: "warning",
    setSnackBarSeverity: (severity: string) => {
        set({
            snackBarSeverity: severity
        })
    },
    snackBarText: "",
    setSnackBarText: (text: string) => {
        set({
            snackBarText: text
        })
    }
}));

export default useEditorPageState;