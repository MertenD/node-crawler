import React from "react";
import DragAndDropFlow from "@/components/editor/pages/canvas/DragAndDropFlow";
import create from "zustand";
import EditIcon from '@mui/icons-material/Edit';
import OutputPage from "@/components/editor/pages/output/OutputPage";
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
        ["canvas", {
            label: "Canvas",
            child: <DragAndDropFlow />,
            icon: <EditIcon />
        }],
        ["output", {
            label: "Output",
            child: <OutputPage />,
            icon: <OutputIcon />
        }]
    ]),
    selectedPage: "canvas",
    onPageChanged: (newPage: string) => {
        set({
            selectedPage: newPage
        })
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