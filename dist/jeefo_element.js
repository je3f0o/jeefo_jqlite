/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : jeefo_element.js
* Created at  : 2017-01-06
* Updated at  : 2017-09-03
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/

var dash_case = require("jeefo_utils/string/dash_case");

// Constructor
var JeefoElement = function (elements) {
	var i;

	// TODO: Think about convert non-html into a text node
	if (typeof elements === "string") {
		// Convert html text into DOM nodes
		var wrapper = document.createElement("div");
		wrapper.insertAdjacentHTML("afterbegin", elements);

		i = this.length = wrapper.childNodes.length;
		while (i--) {
			this[i] = wrapper.childNodes[i];
		}
		wrapper.innerHTML = '';
	} else {
		if ("nodeType" in elements) {
			elements = [ elements ];
		}

		i = this.length = elements.length;
		while (i--) {
			this[i] = elements[i];
		}
	}
};

// Prototypes {{{1
JeefoElement.prototype = {
	length : 0,
	// push   : [].push,
	// sort   : [].sort,
	splice : [].splice, // splice prototype makes array like object

	// DOM methods {{{2
	remove : function () {
		for (var i = 0; i < this.length; ++i) {
			this[i].parentNode.removeChild(this[i]);
		}
	},
	text : function (value) {
		var i = 0;
		if (value === void 0) {
			value = '';
			for (; i < this.length; ++i) {
				value += this[i].textContent;
			}
			return value;
		}
		for (; i < this.length; ++i) {
			this[i].textContent = value;
		}
	},
	replace_with : function (node) {
		this[0].parentNode.replaceChild(node, this[0]);
	},
	append : function (node) {
		this[0].appendChild(node);
	},
	before : function (node) {
		this[0].parentNode.insertBefore(node, this[0]);
	},
	after : function (node) {
		this[0].parentNode.insertBefore(node, this[0].nextSibling);
	},
	clone : function (deep) {
		return new JeefoElement(this[0].cloneNode(deep));
	},
	// Selector methods {{{2
	eq : function (index) {
		return new JeefoElement(this[index]);
	},
	first : function (query) {
		var node = this[0].querySelector(query);
		return node ? new JeefoElement(node) : null;
	},
	find : function (query) {
		return new JeefoElement(this[0].querySelectorAll(query));
	},
	children : function (index) {
		return new JeefoElement(this[0].childNodes[index]);
	},
	// Attribute methods {{{2
	get_attr : function (key) {
		return this[0].getAttribute(dash_case(key));
	},
	set_attr : function (key, value) {
		this[0].setAttribute(dash_case(key), value || '');
	},
	has_attr : function (key) {
		return this[0].hasAttribute(dash_case(key));
	},
	remove_attr : function (key) {
		this[0].removeAttribute(dash_case(key));
	},
	// }}}2
};
// }}}1

require("./event_methods")(JeefoElement.prototype);
require("./class_methods")(JeefoElement.prototype);
require("./style_methods")(JeefoElement.prototype);

module.exports = JeefoElement;
