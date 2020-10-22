class ElementWrapper {
    constructor(tag) {
        this.root = document.createElement(tag);
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    /***
     *
     * @param component {Component | ElementWrapper}
     */
    appendChild(component) {
        this.root.appendChild(component.root);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
}

export class Component {
    constructor() {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    appendChild(component) {
        this.children.push(component);
    }

    get root() {
        if (this._root === null) {
            this._root = this.render().root;
        }
        return this._root;
    }

    render() {
        throw new Error();
    }
}

/**
 *
 * @param tag
 * @param props {Object}
 * @param children
 * @return {ElementWrapper}
 */
export function createElement(tag, props, ...children) {
    console.log(children)
    let e;
    if (typeof tag === "string") {
        e = new ElementWrapper(tag);
    } else {
        e = new tag();
    }
    for (const prop in props) {
        if (Object.prototype.hasOwnProperty.call(props, prop)) {
            e.setAttribute(prop, props[prop]);
        }
    }
    let insertChildren = (children) => {
        for (const child of children) {
            let childEl;
            if (typeof child === "string") {
                childEl = new TextWrapper(child)
            }else {
                childEl = child;
            }
            if (typeof child === "object" && child instanceof Array) {
                insertChildren(child);
            } else {
                e.appendChild(childEl);
            }
        }
    }
    insertChildren(children);
    return e;
}

export function render(component, parentEl) {
    parentEl.appendChild(component.root);
}