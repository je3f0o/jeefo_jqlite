/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : style_methods.js
* Created at  : 2017-08-03
* Updated at  : 2019-12-11
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

//const RADIX = 10;

// ignore:end

const extend_member = require("@jeefo/utils/class/extend_member");

module.exports = JeefoElement => {

// Camel case
const camel_case_replace = (_, letter) => letter.toUpperCase();

/**
 * Converts kebab-case to camelCase.
 * @param name Name to normalize
 */
const kebab_to_camel = (() => {
    const DASH_LOWERCASE_REGEXP = /[_-]([a-z])/g;
    return name => name.replace(DASH_LOWERCASE_REGEXP, camel_case_replace);
})();

/**
 * Converts kebab-case to camelCase. There is also a special case for the
 * ms prefix starting with a lowercase letter.
 * @param name Name to normalize
 */
const css_kebab_to_camel = (() => {
    const MS_HACK_REGEXP = /^-ms-/;
    return name => kebab_to_camel(name.replace(MS_HACK_REGEXP, "ms-"));
})();

/*
// int parser
parse_int = function (value) {
	return parseInt(value, RADIX) || 0;
},

// Make generic method handler curry
make_generic_method_handler_curry = function (method) {
	return function (arg1, arg2) {
		var i = 0, length = this.length, results = [];
		for (; i < length; ++i) {
			results[i] = method(this[i], arg1, arg2);
		}
		if (length === 1) {
			return results[0];
		}

		return results;
	};
},

// Get inner dimention
make_get_inner_dimention = function (is_horizontal) {
	var padding_a, padding_b, border_a, border_b, offset;
	if (is_horizontal) {
		offset    = "offsetWidth";
		border_a  = "borderLeft";
		border_b  = "borderRight";
		padding_a = "paddingLeft";
		padding_b = "paddingRight";
	} else {
		offset    = "offsetHeight";
		border_a  = "borderTop";
		border_b  = "borderBottom";
		padding_a = "paddingTop";
		padding_b = "paddingBottom";
	}

	return function (element) {
		var computed_style    = element.ownerDocument.defaultView.getComputedStyle(element),
			dimention_border  = parse_int(computed_style[border_a ]) + parse_int(computed_style[border_b]),
			dimention_padding = parse_int(computed_style[padding_a]) + parse_int(computed_style[padding_b]);

		return element[offset] - (dimention_border + dimention_padding);
	};
};
*/

// CSS
extend_member(JeefoElement, "rect", function () {
    return this.DOM_element.getBoundingClientRect();
});

extend_member(JeefoElement, "style", function (name, value) {
    const property = css_kebab_to_camel(name);
    if (value === undefined) {
        return this.DOM_element.style[property];
    /*
    } else if (value === null) {
        return this.DOM_element.style.removeProperty(property);
    */
    }
    this.DOM_element.style[property] = value;
});

extend_member(JeefoElement, "css", (() => {
    const object_keys = Object.keys;

    return function (styles) {
        const style_attribute = this.DOM_element.style;
        for (let i = 0, props = object_keys(styles); i < props.length; ++i) {
            const property = css_kebab_to_camel(props[i]);
            style_attribute[property] = styles[props[i]];
        }
    };
})());

extend_member(JeefoElement, "trigger_reflow", function () {
    this.DOM_element.offsetHeight; // jshint ignore:line
});

// Dimention methods
const object_define_property = Object.defineProperty;
object_define_property(JeefoElement.prototype, "width", {
    get () { return this.DOM_element.offsetWidth; },

    set (value) {
        if (typeof value === "number") { value = `${ value }px`; }
        this.DOM_element.style.width = value;
    }
});
object_define_property(JeefoElement.prototype, "height", {
    get () { return this.DOM_element.offsetHeight; },

    set (value) {
        if (typeof value === "number") { value = `${ value }px`; }
        this.DOM_element.style.height = value;
    }
});
/*
prototype.get_inner_width  = make_generic_method_handler_curry(make_get_inner_dimention(true));
prototype.get_inner_height = make_generic_method_handler_curry(make_get_inner_dimention());
*/

// Offset
/*
prototype.offset = make_generic_method_handler_curry(function (element) {
	var rect           = element.getBoundingClientRect(),
		owner_document = element.ownerDocument,
		$document      = owner_document.documentElement,
		$window        = owner_document.defaultView;

	return {
		top  : rect.top  + $window.pageYOffset - $document.clientTop,
		left : rect.left + $window.pageXOffset - $document.clientLeft
	};
});
*/

extend_member(JeefoElement, "get_computed_style", function (pseudo_element) {
    return window.getComputedStyle(this.DOM_element, pseudo_element);
});

};
