/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2017-08-08
* Updated at  : 2017-08-24
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

var JEEFO_ELEMENT = PP.define("JEEFO_ELEMENT", 93370313237);

// ignore:end

var JeefoElement = require("./jeefo_element");

Object.defineProperty(JeefoElement.prototype, "type", {
	get : function () {
		return JEEFO_ELEMENT;
	}
});

module.exports = function (element) {
	if (element.type === JEEFO_ELEMENT) {
		return element;
	}
	return new JeefoElement(element);
};