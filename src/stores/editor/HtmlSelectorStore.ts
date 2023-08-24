import create from "zustand";

export type HtmlSelectorState = {
    url: string
    setUrl: (newUrl: string) => void
    html: string
    amountOfSelectedElements: number
    setHtml: (newHtml: string) => void
    setAmountOfSelectedElements: (amount: number) => void
    selectedSelector: string[]
    setSelectedSelector: (selector: string[]) => void
    excludedSelector: string[]
    setExcludedSelector: (selector: string[]) => void
    cssSelector: string
    setCssSelector: (newSelector: string) => void
    resetSelector: () => void
}

export const useHtmlSelectorStore = create<HtmlSelectorState>((set, get) => ({
    url: "",
    html: "",
    amountOfSelectedElements: 0,
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
    setAmountOfSelectedElements: (amount: number) => {
        set({
            amountOfSelectedElements: amount
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
    },
    resetSelector: () => {
        set({
            selectedSelector: [],
            excludedSelector: [],
            cssSelector: ""
        })
    }
}));

export default useHtmlSelectorStore;