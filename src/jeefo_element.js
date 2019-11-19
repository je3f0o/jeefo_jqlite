/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : jeefo_element.js
* Created at  : 2017-01-06
* Updated at  : 2019-11-16
* Author      : jeefo
* Purpose     :
* Description :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

/*
NODE_TYPE_ELEMENT           = 1,
NODE_TYPE_ATTRIBUTE         = 2,
NODE_TYPE_TEXT              = 3,
NODE_TYPE_COMMENT           = 8,
NODE_TYPE_DOCUMENT          = 9,
NODE_TYPE_DOCUMENT_FRAGMENT = 11

['ELEMENT_NODE', 1],
['ATTRIBUTE_NODE', 2],
['TEXT_NODE', 3],
['CDATA_SECTION_NODE', 4],
['ENTITY_REFERENCE_NODE', 5],
['ENTITY_NODE', 6],
['PROCESSING_INSTRUCTION_NODE', 7],
['COMMENT_NODE', 8],
['DOCUMENT_NODE', 9],
['DOCUMENT_TYPE_NODE', 10],
['DOCUMENT_FRAGMENT_NODE', 11],
['NOTATION_NODE', 12]
*/

const JEEFO_ELEMENT = 933603132357;

//ignore:end

const for_each  = require("@jeefo/utils/object/for_each");
const Readonly  = require("@jeefo/utils/object/readonly");
const dash_case = require("@jeefo/utils/string/dash_case");

let JeefoElement;

class JeefoElements {
    constructor (elements) {
        this.length = elements.length;
        for (let i = 0; i < elements.length; ++i) {
            this[i] = elements[i];
        }
    }

	eq (index) {
		return new JeefoElement(this[index]);
	}

	first (query) {
        for (let i = 0; i < this.length; i += 1) {
            const node = this[i].querySelector(query);
            if (node) { return new JeefoElement(node); }
        }
        return null;
	}

	find (query) {
        const elements = [];
        for (let i = 0; i < this.length; i += 1) {
            const nodes = this[i].querySelectorAll(query);
            for (let j = 0; j < nodes.length; j += 1) {
                elements.push(nodes[j]);
            }
        }
        return new JeefoElements(elements);
	}

	remove () {
		for (let i = 0; i < this.length; ++i) {
			this[i].parentNode.removeChild(this[i]);
		}
	}

	text (value) {
		if (value === undefined) {
			value = '';
			for (let i = 0; i < this.length; ++i) {
                // TODO: research about is textContent right?
				value += this[i].textContent;
			}
			return value;
		}
		for (let i = 0; i < this.length; ++i) {
			this[i].textContent = value;
		}
	}
}

// Constructor
JeefoElement = class JeefoElement {
    constructor (element) {
        this.DOM_element = element;
    }

    get value () {
        switch (this.DOM_element.tagName) {
            case "INPUT"  :
            case "SELECT" :
                return this.DOM_element.value;
        }
        console.warn(`Undefined '${ this.DOM_element.tagName }' input.`);
    }
    set value (value) {
        switch (this.DOM_element.tagName) {
            case "INPUT"  :
            case "SELECT" :
                this.DOM_element.value = value;
                break;
            default:
                console.warn(
                    `Undefined '${ this.DOM_element.tagName }' input.`
                );
        }
    }
	get text ()      { return this.DOM_element.textContent; }
	set text (value) { this.DOM_element.textContent = value; }

    get name () {
        return this.DOM_element.tagName;
    }

    get child_element_length () {
        return this.DOM_element.childElementCount;
    }

	// DOM methods
	remove () {
        this.trigger("ditach");
        if (this.DOM_element && this.DOM_element.parentNode) {
            this.DOM_element.parentNode.removeChild(this.DOM_element);
        }
        this.DOM_element = null;
	}
	before (node) {
        if (node.type === JEEFO_ELEMENT) { node = node.DOM_element; }
		this.DOM_element.parentNode.insertBefore(node, this.DOM_element);
	}
	after (node) {
        if (node.type === JEEFO_ELEMENT) { node = node.DOM_element; }
		this.DOM_element.parentNode.insertBefore(
            node, this.DOM_element.nextSibling
        );
	}
	clone (is_deep) {
        return new JeefoElement(this.DOM_element.cloneNode(is_deep));
	}
	append (node) {
        if (node.type === JEEFO_ELEMENT) { node = node.DOM_element; }
		this.DOM_element.appendChild(node);
	}
	replace (node) {
        if (node.type === JEEFO_ELEMENT) {
            node.trigger("detach");
            node = node.DOM_element;
        } else {
            const $node = new JeefoElement(node);
            $node.trigger("detach");
        }
		this.DOM_element.parentNode.replaceChild(node, this.DOM_element);
        this.DOM_element = node;
        return this;
	}

	// Selector methods
	first (query) {
        const element = this.DOM_element.querySelector(query);
        return element ? new JeefoElement(element) : null;
	}
	find (query) {
        const elements = this.DOM_element.querySelectorAll(query);
        return new JeefoElements(elements);
	}
	children (index) {
		return new JeefoElement(this.DOM_element.childNodes[index]);
	}
    parent () {
		return new JeefoElement(this.DOM_element.parentNode);
    }
    prev () {
		return new JeefoElement(this.DOM_element.previousSibling);
    }
    next () {
		return new JeefoElement(this.DOM_element.nextElementSibling);
    }

	// Attribute methods
	get_attr (key, to_dash_case = true) {
        if (to_dash_case) { key = dash_case(key); }
		return this.DOM_element.getAttribute(key);
	}
	set_attr (key, value = '', to_dash_case = true) {
        if (to_dash_case) { key = dash_case(key); }
		this.DOM_element.setAttribute(key, value);
	}
	has_attr (key, to_dash_case = true) {
        if (to_dash_case) { key = dash_case(key); }
		return this.DOM_element.hasAttribute(key);
	}
	remove_attr (key, to_dash_case = true) {
        if (to_dash_case) { key = dash_case(key); }
		this.DOM_element.removeAttribute(key);
	}
    attrs (attrs, to_dash_case = true) {
        for_each(attrs, (key, value) => {
            this.set_attr(key, value, to_dash_case);
        });
    }

    static is_jeefo_element (element) {
        return element.type === JEEFO_ELEMENT;
    }
};

// Makes array like object
//JeefoElement.prototype.length = 0;
//JeefoElement.prototype.splice = [].splice;
//JeefoElement.prototype.push = [].push;
//JeefoElement.prototype.sort = [].sort;

require("./event_methods")(JeefoElement);
require("./class_methods")(JeefoElement);
require("./style_methods")(JeefoElement);

const r = new Readonly(JeefoElement.prototype);
r.prop("type", JEEFO_ELEMENT);

module.exports = JeefoElement;
