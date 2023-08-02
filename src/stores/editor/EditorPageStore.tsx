import React from "react";
import DragAndDropFlow from "@/components/editor/pages/canvas/DragAndDropFlow";
import create from "zustand";
import EditIcon from '@mui/icons-material/Edit';
import OutputPage from "@/components/editor/pages/output/OutputPage";
import OutputIcon from '@mui/icons-material/Output';
import {AlertColor} from "@mui/material";
import HtmlSelectorPage from "@/components/editor/pages/html/HtmlSelectorPage";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

export type EditorPageState = {
    pages: Map<string, {label: string, child: React.ReactNode, icon?: React.ReactNode }>
    selectedPage: string
    onPageChanged: (newPage: string) => void
    getPage: (pageId: string) => {label: string, child: React.ReactNode, icon?: React.ReactNode }
    isSnackBarOpen: boolean,
    setIsSnackBarOpen: (isOpen: boolean) => void
    snackBarSeverity: AlertColor,
    setSnackBarSeverity: (severity: AlertColor) => void
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
        ["html", {
            label: "HTML",
            child: <HtmlSelectorPage />,
            icon: <ManageSearchIcon />
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
        const page = get().pages.get(pageId);
        if (!page) {
            // Return a default value if no page is found
            return {
                label: '',
                child: <></>,
            };
        }
        return page;
    },
    isSnackBarOpen: false,
    setIsSnackBarOpen: (isOpen: boolean) => {
        set({
            isSnackBarOpen: isOpen
        })
    },
    snackBarSeverity: "warning",
    setSnackBarSeverity: (severity: AlertColor) => {
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

export function openSuccessSnackBar(message: string) {
    useEditorPageState.getState().setSnackBarSeverity("success")
    useEditorPageState.getState().setSnackBarText(message)
    useEditorPageState.getState().setIsSnackBarOpen(true)
}

export function openWarningSnackBar(message: string) {
    useEditorPageState.getState().setSnackBarSeverity("warning")
    useEditorPageState.getState().setSnackBarText(message)
    useEditorPageState.getState().setIsSnackBarOpen(true)
}

export default useEditorPageState;