const RENDER_TO_DOM = Symbol("render to dom");

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }

    setAttribute(name, value) {
        if (name.match(/^on([\s\S]+)/)) {
            this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
        } else {
            if (name === "className") {
                this.root.setAttribute("class", value);
            } else {
                this.root.setAttribute(name, value);
            }
        }
    }

    /**
     *
     * @param component {ElementWrapper | TextWrapper | Component}
     */
    appendChild(component) {
        const range = document.createRange();
        range.setStart(this.root, this.root.childNodes.length);
        range.setEnd(this.root, this.root.childNodes.length);
        // range.deleteContents();
        // this.root.appendChild(component.root);
        component[RENDER_TO_DOM](range);
    }

    /**
     *
     * @param range {Range}
     */
    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }

    /**
     * let oldRange = this._range;
     const range = document.createRange();
     range.setStart(this._range.startContainer, this._range.startOffset);
     range.setEnd(this._range.startContainer, this._range.startOffset);
     this[RENDER_TO_DOM](range);
     oldRange.setStart(oldRange.endContainer, range.endOffset);
     oldRange.deleteContents();
     * @param range
     */
    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

export class Component {
    constructor() {
        this.props = Object.create(null);
        /**@type {Array<Component|TextWrapper|ElementWrapper>}*/
        this.children = [];
        this._root = null;
        this._range = null;
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    /**
     *
     * @param component {ElementWrapper | TextWrapper | Component}
     */
    appendChild(component) {
        this.children.push(component)
    }

    // get root() {
    //     if (!this._root) {
    //         this._root = this.render().root;
    //     }
    //     return this._root;
    // }

    /**
     *
     * @param range {Range}
     */
    [RENDER_TO_DOM](range) {
        this._range = range;
        const renderResult = this.render();
        return renderResult[RENDER_TO_DOM](range);
    }

    render() {
        throw new Error()
    }

    reRender() {
        this._range.deleteContents();
        this[RENDER_TO_DOM](this._range);
    }

    setState(newState) {
        if (
            this.state === null
            || typeof this.state !== "object"
        ) {
            this.state = newState;
            this.reRender();
            return;
        }
        const merge = (oldState, _newState) => {
            for (let p in _newState) {
                if (oldState[p] === null
                    || typeof oldState[p] !== "object") {
                    oldState[p] = _newState[p];
                } else {
                    merge(oldState[p], _newState[p]);
                }
            }
        }
        merge(this.state, newState);
        console.log(this.state);
        this.reRender();
    }
}

/**
 *
 * @param type {string | Function}
 * @param props {null|Object}
 * @param children {ElementWrapper|TextWrapper|Component|Array|string}
 * @returns {ElementWrapper | Component}
 */
export function createElement(type, props, ...children) {
    let dom;
    if (typeof type === "function") {
        dom = new type();
    } else {
        dom = new ElementWrapper(type);
    }
    for (const prop in props) {
        dom.setAttribute(prop, props[prop])
    }
    /**
     *
     * @param children {Array<ElementWrapper|TextWrapper|Component|Array|string>}
     */
    let insertChildren = (children) => {
        for (const child of children) {
            let el;
            if (typeof child === "string" || typeof child === "number") {
                el = new TextWrapper(child + "");
            } else if (Array.isArray(child)) {
                insertChildren(child);
            } else if (typeof child === "object") {
                el = child;
            } else if (child === null) {
                return;
            }
            if (el) dom.appendChild(el);
        }
    }
    insertChildren(children);
    return dom;
}


/**
 *
 * @param component {TextWrapper|ElementWrapper|Component}
 * @param parentElement {HTMLElement}
 */
export function render(component, parentElement) {
    const range = document.createRange();
    range.setStart(parentElement, 0);
    range.setEnd(parentElement, parentElement.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range);
}
