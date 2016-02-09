(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports);if (v !== undefined) module.exports = v;
    } else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'op/Op', '../token/Keyword', '../token/Token', './checks'], factory);
    }
})(function (require, exports) {
    "use strict";

    const Op_1 = require('op/Op');
    const Keyword_1 = require('../token/Keyword');
    const Token_1 = require('../token/Token');
    const checks_1 = require('./checks');
    function parseName(token) {
        const name = tryParseName(token);
        if (Op_1.nonNull(name)) return name;else throw checks_1.unexpected(token);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = parseName;
    function tryParseName(token) {
        return token instanceof Token_1.NameToken ? token.name : Keyword_1.isNameKeyword(token) ? token.name() : null;
    }
    exports.tryParseName = tryParseName;
});
//# sourceMappingURL=parseName.js.map
