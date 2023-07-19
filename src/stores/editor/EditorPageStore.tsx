import React from "react";
import DragAndDropFlow from "@/components/editor/pages/edit/DragAndDropFlow";
import create from "zustand";
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayPage from "@/components/editor/pages/play/PlayPage";

export type EditorPageState = {
    pages: Map<string, {label: string, child: React.ReactNode, icon?: React.ReactNode }>
    selectedPage: string
    onPageChanged: (newPage: string) => void
    getPage: (pageId: string) => {label: string, child: React.ReactNode, icon?: React.ReactNode }
}

export const useEditorPageState = create<EditorPageState>((set, get) => ({
    pages: new Map<string, {label: string, child: React.ReactNode, icon?: React.ReactNode }>([
        ["edit", {
            label: "Edit",
            child: <DragAndDropFlow />,
            icon: <EditIcon />
        }],
        ["play", {
            label: "Play",
            child: <PlayPage />,
            icon: <PlayArrowIcon />
        }]
    ]),
    selectedPage: "edit",
    onPageChanged: (newPage: string) => {
        set({
            selectedPage: newPage
        })
        console.log("Set selected page", newPage, get().selectedPage)
    },
    getPage: (pageId: string) => {
        return get().pages.get(pageId)
    }
}));

export default useEditorPageState;