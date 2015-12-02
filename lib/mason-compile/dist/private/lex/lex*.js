"use strict";

(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports);
		global.lex = mod.exports;
	}
})(this, function (exports) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.load = load;
	let lexQuote = exports.lexQuote = undefined;

	function load(_) {
		exports.lexQuote = lexQuote = _.lexQuote;
	}
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcml2YXRlL2xleC9sZXgqLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQUlnQixJQUFJLEdBQUosSUFBSTtLQUZULFFBQVEsV0FBUixRQUFROztVQUVILElBQUk7VUFGVCxRQUFRLEdBR2xCLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSIsImZpbGUiOiJsZXgqLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVE9ETzpFUzYgUmVjdXJzaXZlIG1vZHVsZXMgc2hvdWxkIHdvcmssIHNvIHRoaXMgc2hvdWxkIG5vdCBiZSBuZWNlc3NhcnkuXG5cbmV4cG9ydCBsZXQgbGV4UXVvdGVcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWQoXykge1xuXHRsZXhRdW90ZSA9IF8ubGV4UXVvdGVcbn1cbiJdfQ==