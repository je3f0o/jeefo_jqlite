/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2017-08-08
* Updated at  : 2017-09-03
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/

var JeefoElement = require("./jeefo_element");

Object.defineProperty(JeefoElement.prototype, "type", {
	value : 93370313237
});

module.exports = function jqlite (element) {
	if (element.type === 93370313237) {
		return element;
	}
	return new JeefoElement(element);
};
