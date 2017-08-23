/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : event_methods.js
* Created at  : 2017-08-03
* Updated at  : 2017-08-11
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/

var passive  = { passive : true },
	is_array = Array.isArray;

//EVENT_ALIAS = { rightclick : "contextmenu" }, // Move to Preprocessor

var supports_passive = false;
try {
	var opts = Object.defineProperty({}, "passive", {
		get : function () { supports_passive = true; }
	});
	window.addEventListener("test", null, opts);
} catch (e) {}
/*
var is_event_supported = function (el, event_name) {
	event_name = "on" + event_name;

	if (event_name in el) {
		return true;
	}

	el.setAttribute(event_name, "return;");
	return typeof el[event_name] === "function";
};
*/

var is_passive_event = function (event_name) {
	return event_name === "passive";
},

get_options = function (event_name) {
	if (is_passive_event(event_name)) {
		return passive;
	}
	return false;
};

module.exports = function (prototype) {

// Once event {{{1
prototype.once = function (events, event_handler) {
	var listener = this.on(events, function (event) {
		this.removeEventListener(event.type, listener, get_options(event.type));
		event_handler.call(this, event);
	});

	return listener;
};

// On event {{{1
prototype.on = function (events, event_handler) {
	var i = this.length;

	while (i--) {
		if (is_array(events)) {
			var j = events.length;
			while (j--) {
				this[i].addEventListener(events[j], event_handler, get_options(events[j]));
			}
		} else {
			this[i].addEventListener(events, event_handler, get_options(events));
		}
	}

	return event_handler;
};

// Off event {{{1
prototype.off = function (events, event_handler) {
	var i = this.length;

	while (i--) {
		if (is_array(events)) {
			var j = events.length;
			while (j--) {
				this[i].removeEventListener(events[j], event_handler, get_options(events[j]));
			}
		} else {
			this[i].removeEventListener(events, event_handler, get_options(events));
		}
	}
};

// Trigger event {{{1
prototype.trigger = function (event_name, bubble) {
	for (var i = 0, ev = document.createEvent("Event"); i < this.length; ++i) {
		ev.initEvent(event_name, bubble, true);
		this[i].dispatchEvent(ev);
	}
};
// }}}1

};
