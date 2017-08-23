/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : style_methods.js
* Created at  : 2017-08-03
* Updated at  : 2017-08-08
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/

module.exports = function (prototype) {

var object_keys           = Object.keys,
	MS_HACK_REGEXP        = /^-ms-/,
	DASH_LOWERCASE_REGEXP = /[_-]([a-z])/g,

// Camel case {{{1
camel_case_replace = function (all, letter) {
	return letter.toUpperCase();
},

/**
 * Converts kebab-case to camelCase.
 * @param name Name to normalize
 */
kebab_to_camel = function (name) {
	return name.replace(DASH_LOWERCASE_REGEXP, camel_case_replace);
},

/**
 * Converts kebab-case to camelCase.
 * There is also a special case for the ms prefix starting with a lowercase letter.
 * @param name Name to normalize
 */
css_kebab_to_camel = function (name) {
	return kebab_to_camel(name.replace(MS_HACK_REGEXP, "ms-"));
},

// int parser {{{1
parse_int = function (value) {
	return parseInt(value, 10) || 0;
},

// CSS handler {{{1
css_handler = function (element, name, value) {
	name = css_kebab_to_camel(name);

	if (value !== void 0) {
		element.style[name] = value;
	} else {
		return element.style[name];
	}
},

// Make dimention handler curry {{{1
make_dimention_handler_curry = function (is_horizontal) {
	var side, side_property;
	if (is_horizontal) {
		side          = "width";
		side_property = "offsetWidth";
	} else {
		side          = "height";
		side_property = "offsetHeight";
	}

	return function (value) {
		var i = this.length - 1;

		if (value !== void 0) {
			for (; i >= 0; --i) {
				css_handler(this[i], side, value);
			}
		} else if (this.length === 1) {
			return this[0][side_property];
		} else {
			var results = [];

			for (; i >= 0; --i) {
				results[i] = this[i][side_property];
			}

			return results;
		}
	};
},

// Make generic method handler curry {{{1
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

// Get inner dimention {{{1
make_get_inner_dimention = function (is_horizontal) {
	var padding_a, padding_b, border_a, border_b, offset;
	if (is_horizontal) {
		offset    = "offsetWidth";
		border_a  = "borderTop";
		border_b  = "borderBottom";
		padding_a = "paddingTop";
		padding_b = "paddingBottom";
	} else {
		offset    = "offsetHeight";
		border_a  = "borderLeft";
		border_b  = "borderRight";
		padding_a = "paddingLeft";
		padding_b = "paddingRight";
	}

	return function (element) {
		var computed_style    = element.ownerDocument.defaultView.getComputedStyle(element),
			dimention_border  = parse_int(computed_style[border_a ]) + parse_int(computed_style[border_b]),
			dimention_padding = parse_int(computed_style[padding_a]) + parse_int(computed_style[padding_b]);

		return element[offset] - (dimention_border + dimention_padding);
	};
};

// Dimention methods {{{1
prototype.width = function (value) {
	if (value === void 0) {
		return this[0].offsetWidth;
	}
	css_handler(this[0], "width", value);
};
prototype.height = make_dimention_handler_curry();

prototype.get_inner_width  = make_generic_method_handler_curry(make_get_inner_dimention(true));
prototype.get_inner_height = make_generic_method_handler_curry(make_get_inner_dimention());

// CSS {{{1
prototype.css = function (name, value) {
	if (name !== null && typeof name === "object") {
		for (var i = 0, keys = object_keys(name); i < keys.length; ++i) {
			css_handler(this[0], keys[i], name[keys[i]]);
		}
	} else {
		return css_handler(this[0], name, value);
	}
};

// Offset {{{1
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
// }}}1

};
