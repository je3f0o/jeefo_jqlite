/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_methods.js
* Created at  : 2017-08-03
* Updated at  : 2017-08-08
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/

module.exports = function (prototype) {

// ClassList
if (Element.prototype.hasOwnProperty("classList")) {
	prototype.add_class = function () {
		this[0].classList.add.apply(this[0].classList, arguments);
	};
	prototype.remove_class = function () {
		this[0].classList.remove.apply(this[0].classList, arguments);
	};
	prototype.toggle_class = function (name) {
		this[0].classList.toggle(name);
	};
	prototype.has_class = function (name) {
		return this[0].classList.contains(name);
	};
} else {
	// IE8/9, Safari
	var class_regex = function (name) {
		return new RegExp("(^| )" + name + "( |$)");
	};

	prototype.add_class = function () {
		for (var i = 0; i < arguments.length; ++i) {
			! this.has_class(arguments[i]) && (this[0].className += this[0].className ? ' ' + arguments[i] : arguments[i]); // jshint ignore:line
		}
	};
	prototype.remove_class = function () {
		for (var i = 0; i < arguments.length; ++i) {
			this[0].className = this[0].className.replace(class_regex(arguments[i]), '');
		}
	};
	prototype.toggle_class = function (name) {
		return this.has_class(name) ? (this.remove_class(name), false) : (this.add_class(name), true);
	};
	prototype.has_class = function (name) {
		return class_regex(name).test(this[0].className);
	};
}

prototype.replace_class = function (old_name, new_name) {
	this.remove_class(old_name), this.add_class(new_name); // jshint ignore:line
};

};
