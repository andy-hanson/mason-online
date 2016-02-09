var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports);if (v !== undefined) module.exports = v;
    } else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../ast/Block', '../ast/Fun', '../ast/locals', '../ast/Poly', '../token/Group', '../token/Keyword', '../util', './checks', './parseBlock', './parseCase', './parseLocalDeclares', './parsePipe', './parseSpaced', './parseSwitch', './Slice', './tryTakeComment'], factory);
    }
})(function (require, exports) {
    "use strict";

    const Block_1 = require('../ast/Block');
    const Fun_1 = require('../ast/Fun');
    const locals_1 = require('../ast/locals');
    const Poly_1 = require('../ast/Poly');
    const Group_1 = require('../token/Group');
    const Keyword_1 = require('../token/Keyword');
    const util_1 = require('../util');
    const checks_1 = require('./checks');
    const parseBlock_1 = require('./parseBlock');
    const parseCase_1 = require('./parseCase');
    const parseLocalDeclares_1 = require('./parseLocalDeclares');
    const parsePipe_1 = require('./parsePipe');
    const parseSpaced_1 = require('./parseSpaced');
    const parseSwitch_1 = require('./parseSwitch');
    const Slice_1 = require('./Slice');
    const tryTakeComment_1 = require('./tryTakeComment');
    function parseFunBlock(_ref, tokens) {
        let isThisFun = _ref.isThisFun;
        let isDo = _ref.isDo;
        let kind = _ref.kind;

        var _tryTakeReturnType = tryTakeReturnType(tokens);

        var _tryTakeReturnType2 = _slicedToArray(_tryTakeReturnType, 2);

        const opReturnType = _tryTakeReturnType2[0];
        const rest = _tryTakeReturnType2[1];

        var _funArgsAndBlock = funArgsAndBlock(rest, !isDo);

        const args = _funArgsAndBlock.args;
        const opRestArg = _funArgsAndBlock.opRestArg;
        const block = _funArgsAndBlock.block;

        return new Fun_1.FunBlock(tokens.loc, args, opRestArg, block, { kind: kind, isThisFun: isThisFun, isDo: isDo, opReturnType: opReturnType });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = parseFunBlock;
    function parsePolyValue(_ref2, tokens) {
        let isThisFun = _ref2.isThisFun;
        let isDo = _ref2.isDo;
        let kind = _ref2.kind;

        var _tryTakeReturnType3 = tryTakeReturnType(tokens);

        var _tryTakeReturnType4 = _slicedToArray(_tryTakeReturnType3, 2);

        const opReturnType = _tryTakeReturnType4[0];
        const rest = _tryTakeReturnType4[1];

        var _parseBlock_1$beforeA = parseBlock_1.beforeAndBlock(rest);

        var _parseBlock_1$beforeA2 = _slicedToArray(_parseBlock_1$beforeA, 2);

        const before = _parseBlock_1$beforeA2[0];
        const blockLines = _parseBlock_1$beforeA2[1];

        var _tryTakeComment_1$def = tryTakeComment_1.default(blockLines);

        var _tryTakeComment_1$def2 = _slicedToArray(_tryTakeComment_1$def, 2);

        const opComment = _tryTakeComment_1$def2[0];
        const restLines = _tryTakeComment_1$def2[1];

        if (restLines.size() === 1) {
            const h = restLines.headSlice();
            if (h.size() === 1 && Keyword_1.isKeyword(33, h.head())) {
                var _parseFunLocals = parseFunLocals(before);

                const args = _parseFunLocals.args;
                const opRestArg = _parseFunLocals.opRestArg;

                return new Poly_1.FunAbstract(tokens.loc, args, opRestArg, opReturnType, opComment);
            }
        }

        var _funArgsAndBlock2 = funArgsAndBlock(rest, !isDo);

        const args = _funArgsAndBlock2.args;
        const opRestArg = _funArgsAndBlock2.opRestArg;
        const block = _funArgsAndBlock2.block;

        return new Fun_1.FunBlock(tokens.loc, args, opRestArg, block, { kind: kind, isThisFun: isThisFun, isDo: isDo, opReturnType: opReturnType });
    }
    exports.parsePolyValue = parsePolyValue;
    function funArgsAndBlock(tokens, isVal) {
        let includeMemberArgs = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        checks_1.checkNonEmpty(tokens, _ => _.expectedBlock);
        const h = tokens.head();
        if (isFunFocusKeyword(h)) {
            const args = [locals_1.LocalDeclare.focus(h.loc)];

            var _parseBlock_1$beforeA3 = parseBlock_1.beforeAndBlock(tokens.tail());

            var _parseBlock_1$beforeA4 = _slicedToArray(_parseBlock_1$beforeA3, 2);

            const before = _parseBlock_1$beforeA4[0];
            const block = _parseBlock_1$beforeA4[1];

            checks_1.checkEmpty(before, _ => _.funFocusArgIsImplicit(h.kind));
            const parser = (() => {
                switch (h.kind) {
                    case 1:
                        return parseCase_1.parseCaseFun;
                    case 12:
                        return parsePipe_1.parsePipeFun;
                    case 14:
                        return parseSwitch_1.parseSwitchFun;
                    default:
                        throw checks_1.unexpected(h);
                }
            })();
            const expr = parser(tokens.loc, block);
            return { args: args, opRestArg: null, memberArgs: [], block: new Block_1.default(tokens.loc, null, [expr]) };
        } else {
            var _parseBlock_1$beforeA5 = parseBlock_1.beforeAndBlock(tokens);

            var _parseBlock_1$beforeA6 = _slicedToArray(_parseBlock_1$beforeA5, 2);

            const before = _parseBlock_1$beforeA6[0];
            const blockLines = _parseBlock_1$beforeA6[1];

            var _parseFunLocals2 = parseFunLocals(before, includeMemberArgs);

            const args = _parseFunLocals2.args;
            const opRestArg = _parseFunLocals2.opRestArg;
            const memberArgs = _parseFunLocals2.memberArgs;

            const block = parseBlock_1.default(blockLines);
            return { args: args, opRestArg: opRestArg, memberArgs: memberArgs, block: block };
        }
    }
    exports.funArgsAndBlock = funArgsAndBlock;
    function isFunFocusKeyword(_) {
        return _ instanceof Keyword_1.KeywordPlain && (_.kind === 1 || _.kind === 12 || _.kind === 14);
    }
    function tryTakeReturnType(tokens) {
        if (!tokens.isEmpty()) {
            const h = tokens.head();
            if (h instanceof Group_1.GroupSpace && Keyword_1.isKeyword(38, util_1.head(h.subTokens))) return [parseSpaced_1.default(Slice_1.Tokens.of(h).tail()), tokens.tail()];
        }
        return [null, tokens];
    }
    function parseFunLocals(tokens) {
        let includeMemberArgs = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        if (tokens.isEmpty()) return { args: [], memberArgs: [], opRestArg: null };else {
            let rest = tokens,
                opRestArg = null;
            const l = tokens.last();
            if (l instanceof Group_1.GroupSpace) {
                const g = Slice_1.Tokens.of(l);
                if (Keyword_1.isKeyword(27, g.head())) {
                    rest = tokens.rtail();
                    opRestArg = parseLocalDeclares_1.parseLocalDeclareFromSpaced(g.tail());
                }
            }
            if (includeMemberArgs) {
                var _parseLocalDeclares_ = parseLocalDeclares_1.parseLocalDeclaresAndMemberArgs(rest);

                const args = _parseLocalDeclares_.declares;
                const memberArgs = _parseLocalDeclares_.memberArgs;

                return { args: args, memberArgs: memberArgs, opRestArg: opRestArg };
            } else return { args: parseLocalDeclares_1.default(rest), memberArgs: [], opRestArg: opRestArg };
        }
    }
});
//# sourceMappingURL=parseFunBlock.js.map
