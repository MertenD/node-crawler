import create from "zustand";

export type HtmlSelectorState = {
    url: string
    setUrl: (newUrl: string) => void
    html: string
    setHtml: (newHtml: string) => void
    selectedSelector: string[]
    setSelectedSelector: (selector: string[]) => void
    excludedSelector: string[]
    setExcludedSelector: (selector: string[]) => void
    cssSelector: string
    setCssSelector: (newSelector: string) => void
}

export const useHtmlSelectorStore = create<HtmlSelectorState>((set, get) => ({
    url: "",
    html: "",
    selectedSelector: [],
    excludedSelector: [],
    cssSelector: "",
    setUrl: (newUrl: string) => {
        set({
            url: newUrl
        })
    },
    setHtml: (newHtml: string) => {
        set({
            html: newHtml
        })
    },
    setSelectedSelector: (selector: string[]) => {
        set({
            selectedSelector: selector
        })
    },
    setExcludedSelector: (selector: string[]) => {
        set({
            excludedSelector: selector
        })
    },
    setCssSelector: (newSelector: string) => {
        set({
            cssSelector: newSelector
        })
    }
}));

export default useHtmlSelectorStore;