/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2017-08-08
* Updated at  : 2019-11-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const JeefoElement  = require("./jeefo_element");
const JeefoElements = require("./jeefo_elements");

const is_object = o => o !== null && typeof o === "object";

module.exports = function jqlite (element) {
	if (JeefoElement.is_jeefo_element(element)) {
		return element;
    } else if (typeof element === "string") {
        // Convert html text into DOM nodes
        let wrapper = document.createElement("div");
        wrapper.insertAdjacentHTML("afterbegin", element);

        const elements = [];
        while (wrapper.firstChild) {
            elements.push(wrapper.firstChild);
            wrapper.removeChild(wrapper.firstChild);
        }
        if (elements.length > 1) {
            return new JeefoElements(elements);
        } else if (elements.length === 1) {
            element = elements[0];
        }
	}

    if (is_object(element) && "nodeType" in element) {
        return new JeefoElement(element);
    }

    throw new Error("Invalid argument: jqlite(element)");
};
