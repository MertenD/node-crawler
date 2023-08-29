export function getUniqueSelector(el: any): string {
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

/*export function getUniqueSelector(el) {
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

export function removeIDFromSelector(selector: string): string {
    return selector.replace(/#[^\s]+/g, '');
}

export function isValidSelector(iframeDoc: any, selector: string): boolean {
    try {
        iframeDoc.querySelector(selector);
        return true;
    } catch (e) {
        return false
    }
}