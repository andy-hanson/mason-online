'use strict';

(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', 'esast/dist/Loc', '../CompileError', './PathOptions'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('esast/dist/Loc'), require('../CompileError'), require('./PathOptions'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.Loc, global.CompileError, global.PathOptions);
		global.context = mod.exports;
	}
})(this, function (exports, _Loc, _CompileError, _PathOptions) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.pathOptions = exports.warnings = exports.options = undefined;
	exports.setContext = setContext;
	exports.unsetContext = unsetContext;
	exports.check = check;
	exports.fail = fail;
	exports.warn = warn;

	var _CompileError2 = _interopRequireDefault(_CompileError);

	var _PathOptions2 = _interopRequireDefault(_PathOptions);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	let options = exports.options = undefined;
	let warnings = exports.warnings = undefined;
	let pathOptions = exports.pathOptions = undefined;

	function setContext(_options, filename) {
		exports.options = options = _options;
		exports.pathOptions = pathOptions = new _PathOptions2.default(filename);
		exports.warnings = warnings = [];
	}

	function unsetContext() {
		exports.options = options = null;
		exports.warnings = warnings = null;
	}

	function check(cond, loc, message) {
		if (!cond) {
			if (loc instanceof Function) loc = loc();
			if (message instanceof Function) message = message();
			fail(loc, message);
		}
	}

	function fail(loc, message) {
		throw new _CompileError2.default(warning(loc, message));
	}

	function warn(loc, message) {
		warnings.push(warning(loc, message));
	}

	const warning = (loc, message) => {
		if (loc instanceof _Loc.Pos) loc = (0, _Loc.singleCharLoc)(loc);
		return new _CompileError.Warning(loc, message);
	};
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcml2YXRlL2NvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQWtCZ0IsVUFBVSxHQUFWLFVBQVU7U0FPVixZQUFZLEdBQVosWUFBWTtTQVNaLEtBQUssR0FBTCxLQUFLO1NBY0wsSUFBSSxHQUFKLElBQUk7U0FVSixJQUFJLEdBQUosSUFBSTs7Ozs7Ozs7Ozs7O0tBckRULE9BQU8sV0FBUCxPQUFPO0tBS1AsUUFBUSxXQUFSLFFBQVE7S0FFUixXQUFXLFdBQVgsV0FBVzs7VUFNTixVQUFVO1VBYmYsT0FBTyxHQWNqQixPQUFPLEdBQUcsUUFBUTtVQVBSLFdBQVcsR0FRckIsV0FBVyxHQUFHLDBCQUFnQixRQUFRLENBQUM7VUFWN0IsUUFBUSxHQVdsQixRQUFRLEdBQUcsRUFBRTs7O1VBSUUsWUFBWTtVQXBCakIsT0FBTyxHQXFCakIsT0FBTyxHQUFHLElBQUk7VUFoQkosUUFBUSxHQWlCbEIsUUFBUSxHQUFHLElBQUk7OztVQU9BLEtBQUs7Ozs7Ozs7O1VBY0wsSUFBSTs7OztVQVVKLElBQUkiLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UG9zLCBzaW5nbGVDaGFyTG9jfSBmcm9tICdlc2FzdC9kaXN0L0xvYydcbmltcG9ydCBDb21waWxlRXJyb3IsIHtXYXJuaW5nfSBmcm9tICcuLi9Db21waWxlRXJyb3InXG5pbXBvcnQgUGF0aE9wdGlvbnMgZnJvbSAnLi9QYXRoT3B0aW9ucydcblxuLyoqIEB0eXBlIHtDb21waWxlT3B0aW9uc30gKi9cbmV4cG9ydCBsZXQgb3B0aW9uc1xuLyoqXG5BcnJheSBvZiBhbGwgd2FybmluZ3MgcHJvZHVjZWQgZHVyaW5nIGNvbXBpbGF0aW9uLlxuKFBsZWFzZSB1c2Uge0B3YXJufSBpbnN0ZWFkIG9mIHdyaXRpbmcgdG8gdGhpcyBkaXJlY3RseS4pXG4qL1xuZXhwb3J0IGxldCB3YXJuaW5nc1xuLyoqIEB0eXBlIHtQYXRoT3B0aW9uc30gKi9cbmV4cG9ydCBsZXQgcGF0aE9wdGlvbnNcblxuLyoqXG5Xcml0ZSB0byB7QGxpbmsgb3B0aW9uc30gYW5kIHtAbGluayB3YXJuaW5nc30uXG5SZW1lbWJlciB0byBjYWxsIHtAbGluayB1bnNldENvbnRleHR9IVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRDb250ZXh0KF9vcHRpb25zLCBmaWxlbmFtZSkge1xuXHRvcHRpb25zID0gX29wdGlvbnNcblx0cGF0aE9wdGlvbnMgPSBuZXcgUGF0aE9wdGlvbnMoZmlsZW5hbWUpXG5cdHdhcm5pbmdzID0gW11cbn1cblxuLyoqIFJlbGVhc2Uge0BsaW5rIG9wdGlvbnN9IGFuZCB7QGxpbmsgd2FybmluZ3N9IGZvciBnYXJiYWdlIGNvbGxlY3Rpb24uICovXG5leHBvcnQgZnVuY3Rpb24gdW5zZXRDb250ZXh0KCkge1xuXHRvcHRpb25zID0gbnVsbFxuXHR3YXJuaW5ncyA9IG51bGxcbn1cblxuLyoqXG5JZiBgY29uZGAgaXMgZmFsc2UsIHtAbGluayBmYWlsfS5cbmBsb2NgIGFuZCBgbWVzc2FnZWAgbWF5IGFsc28gYmUgRnVuY3Rpb25zIHRvIHRvIGdldCB0aGVtIGxhemlseS5cbiovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2soY29uZCwgbG9jLCBtZXNzYWdlKSB7XG5cdGlmICghY29uZCkge1xuXHRcdGlmIChsb2MgaW5zdGFuY2VvZiBGdW5jdGlvbilcblx0XHRcdGxvYyA9IGxvYygpXG5cdFx0aWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBGdW5jdGlvbilcblx0XHRcdG1lc3NhZ2UgPSBtZXNzYWdlKClcblx0XHRmYWlsKGxvYywgbWVzc2FnZSlcblx0fVxufVxuXG4vKipcblRocm93IGEge0BsaW5rIENvbXBpbGVFcnJvcn0uXG5QYXJhbWV0ZXJzIGFyZSB0aGUgc2FtZSBhcyBmb3Ige0BsaW5rIHdhcm59LlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmYWlsKGxvYywgbWVzc2FnZSkge1xuXHR0aHJvdyBuZXcgQ29tcGlsZUVycm9yKHdhcm5pbmcobG9jLCBtZXNzYWdlKSlcbn1cblxuLyoqXG5BZGQgYSBuZXcgd2FybmluZy5cbkBwYXJhbSB7TG9jfFBvc30gbG9jXG5AcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuXHRXaWxsIG9mdGVuIGNvbnRhaW4gc2VxdWVuY2VzIGNyZWF0ZWQgYnkge0BsaW5rIGNvZGV9LlxuKi9cbmV4cG9ydCBmdW5jdGlvbiB3YXJuKGxvYywgbWVzc2FnZSkge1xuXHR3YXJuaW5ncy5wdXNoKHdhcm5pbmcobG9jLCBtZXNzYWdlKSlcbn1cblxuY29uc3Qgd2FybmluZyA9IChsb2MsIG1lc3NhZ2UpID0+IHtcblx0aWYgKGxvYyBpbnN0YW5jZW9mIFBvcylcblx0XHRsb2MgPSBzaW5nbGVDaGFyTG9jKGxvYylcblx0cmV0dXJuIG5ldyBXYXJuaW5nKGxvYywgbWVzc2FnZSlcbn1cbiJdfQ==