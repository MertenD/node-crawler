import React, {useEffect, useRef} from "react";
import "../canvas/toolbars/Html.css"
import {SelectorSelectionModes} from "@/components/editor/pages/html/HtmlSelectorPage";
import useHtmlSelectorStore from "@/stores/editor/HtmlSelectorStore";

const highlightCss = ".selectedForSelector { background-color: lightgreen; } .excluded { background-color: tomato; }";

const selector = (state: any) => ({
    html: state.html,
    setCssSelector: state.setCssSelector,
    selectedSelector: state.selectedSelector as string[],
    excludedSelector: state.excludedSelector as string[],
    setSelectedSelector: state.setSelectedSelector,
    setExcludedSelector: state.setExcludedSelector
});

export interface SelectableHtmlPreviewProps {
    selectionMode: SelectorSelectionModes
}

export function SelectableHtmlPreview(props: SelectableHtmlPreviewProps) {
    const { html, setCssSelector, selectedSelector, excludedSelector, setSelectedSelector, setExcludedSelector } = useHtmlSelectorStore(state => selector(state))

    const selectedSelectorRef = useRef(selectedSelector);
    const excludedSelectorRef = useRef(excludedSelector)

    const selectionModeRef = useRef(props.selectionMode);
    const iframeRef = useRef(null)

    useEffect(() => {
        selectionModeRef.current = props.selectionMode;
    }, [props.selectionMode]);

    useEffect(() => {
        // Access the document within the iframe
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;

        // Set the HTML content inside the iframe
        iframeDoc.body.innerHTML = html;

        // Add the CSS rules for highlighting
        const styleTag = iframeDoc.createElement("style");
        styleTag.innerHTML = highlightCss;
        iframeDoc.head.appendChild(styleTag);

        // Add the event listener
        iframeDoc.body.addEventListener('click', handleElementClick);

        // Remove the event listener when unmounting
        return () => {
            iframeDoc.body.removeEventListener('click', handleElementClick);
        };
    }, [html]);

    useEffect(() => {

        selectedSelectorRef.current = selectedSelector;
        excludedSelectorRef.current = excludedSelector;

        if (excludedSelector.length > 0) {
            setCssSelector(selectedSelector.join() + ":not(" + excludedSelector.join() + ")")
        } else {
            setCssSelector(selectedSelector.join())
        }

        // Get document from iFrame
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;

        iframeDoc.querySelectorAll('.selectedForSelector').forEach(el => el.classList.remove('selectedForSelector'));
        iframeDoc.querySelectorAll('.excluded').forEach(el => el.classList.remove('excluded'));

        if (isValidSelector(iframeDoc, selectedSelector.join())) {
            iframeDoc.querySelectorAll(selectedSelector.join()).forEach(el => el.classList.add('selectedForSelector'));
        }

        if (isValidSelector(iframeDoc, excludedSelector.join())) {
            iframeDoc.querySelectorAll(excludedSelector.join()).forEach(el => el.classList.add('excluded'));
        }
    }, [selectedSelector, excludedSelector, html]);

    const handleElementClick = (event) => {
        event.preventDefault();
        const element = event.target;

        let selectorForClick = removeIDFromSelector(getUniqueSelector(element));

        switch (selectionModeRef.current) {
            case SelectorSelectionModes.ADD_TO_SELECTION:
                setExcludedSelector(excludedSelectorRef.current.filter(selector => selector !== selectorForClick))
                setSelectedSelector([...selectedSelectorRef.current.filter(selector => selector !== selectorForClick), selectorForClick])
                break
            case SelectorSelectionModes.EXCLUDE_FROM_SELECTION:
                setSelectedSelector(selectedSelectorRef.current.filter(selector => selector !== selectorForClick))
                setExcludedSelector([...excludedSelectorRef.current.filter(selector => selector !== selectorForClick), selectorForClick])
                break
        }
    };

    return <iframe style={{
        height: "100%",
        width: "100%"
    }} ref={iframeRef} sandbox="allow-same-origin" />;
}

/*function getUniqueSelector(el) {
    let path = [];
    while (el.nodeType === Node.ELEMENT_NODE) {
        let selector = el.nodeName.toLowerCase();
        console.log('Current Selector:', selector);

        // Wenn der Name einen Bindestrich enthält, handelt es sich um ein benutzerdefiniertes Element
        if (selector.includes('-')) {
            path.unshift(selector);
        } else if (el.id) {
            selector += `#${el.id}`;
            path.unshift(selector);
            break;
        } else {
            let sib = el, nth = 1;
            while (sib = sib.previousElementSibling) {
                if (sib.nodeName.toLowerCase() === selector) nth++;
            }
            if (nth !== 1) selector += `:nth-of-type(${nth})`;
            path.unshift(selector);
        }
        el = el.parentNode;
    }
    return path.join(' > ');
}*/

function getUniqueSelector(el) {
    let path = [];
    while (el.nodeType === Node.ELEMENT_NODE) {
        let selector = el.nodeName.toLowerCase();

        if (el.id) {
            selector += `#${el.id}`;
        } else {
            let sib = el, nth = 1;
            while (sib = sib.previousElementSibling) {
                if (sib.nodeName.toLowerCase() === selector) nth++;
            }
            if (nth !== 1) selector += `:nth-of-type(${nth})`;
        }

        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(' > ');
}


function removeIDFromSelector(selector) {
    return selector.replace(/#[^\s]+/g, '');
}

function isValidSelector(iframeDoc, selector) {
    try {
        iframeDoc.querySelector(selector);
        return true;
    } catch (e) {
        return false
    }
}
