/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2017-08-08
* Updated at  : 2019-06-27
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

module.exports = function jqlite (element) {
	if (JeefoElement.is_jeefo_element(element)) {
		return element;
    } else if (typeof element === "string") {
        // Convert html text into DOM nodes
        let wrapper = document.createElement("div");
        wrapper.insertAdjacentHTML("afterbegin", element);

        if (wrapper.childNodes.length > 1) {
            throw new Error("JeefoElement must be exactly 1 DOM Element");
        }
        element = wrapper.childNodes[0];
        wrapper.innerHTML = '';
	}

    if (element !== null && typeof element === "object") {
        if ("nodeType" in element) {
            return new JeefoElement(element);
        }
        return new JeefoElements(element);
    }

    throw new Error("Invalid argument: jqlite(element)");
};
