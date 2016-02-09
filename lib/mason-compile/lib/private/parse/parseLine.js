var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports);if (v !== undefined) module.exports = v;
    } else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'op/Op', '../ast/BuildEntry', '../ast/Call', '../ast/Do', '../ast/errors', '../ast/locals', '../ast/Loop', '../ast/Quote', '../ast/Val', '../context', '../token/Group', '../token/Keyword', '../util', './checks', './parseBlock', './parseExpr', './parseLocalDeclares', './parseMemberName', './parseName', './parseQuote', './parseSpaced', './parseTraitDo', './Slice'], factory);
    }
})(function (require, exports) {
    "use strict";

    const Op_1 = require('op/Op');
    const BuildEntry_1 = require('../ast/BuildEntry');
    const Call_1 = require('../ast/Call');
    const Do_1 = require('../ast/Do');
    const errors_1 = require('../ast/errors');
    const locals_1 = require('../ast/locals');
    const Loop_1 = require('../ast/Loop');
    const Quote_1 = require('../ast/Quote');
    const Val_1 = require('../ast/Val');
    const context_1 = require('../context');
    const Group_1 = require('../token/Group');
    const Keyword_1 = require('../token/Keyword');
    const util_1 = require('../util');
    const checks_1 = require('./checks');
    const parseBlock_1 = require('./parseBlock');
    const parseExpr_1 = require('./parseExpr');
    const parseLocalDeclares_1 = require('./parseLocalDeclares');
    const parseMemberName_1 = require('./parseMemberName');
    const parseName_1 = require('./parseName');
    const parseQuote_1 = require('./parseQuote');
    const parseSpaced_1 = require('./parseSpaced');
    const parseTraitDo_1 = require('./parseTraitDo');
    const Slice_1 = require('./Slice');
    function parseLine(tokens) {
        const loc = tokens.loc;
        const head = tokens.head();
        const rest = () => tokens.tail();
        const noRest = () => {
            checks_1.checkEmpty(rest(), _ => _.unexpectedAfter(head));
        };
        if (head instanceof Keyword_1.KeywordComment) {
            util_1.assert(head.kind === 'region');
            return parseLines(parseBlock_1.justBlock(55, rest()));
        }
        if (Keyword_1.isLineStartKeyword(head)) switch (head.kind) {
            case 24:
            case 28:
                return parseAssert(head.kind === 28, rest());
            case 25:
                return new Loop_1.Break(loc, parseExpr_1.opParseExpr(rest()));
            case 26:
                noRest();
                return new Do_1.SpecialDo(loc, 0);
            case 27:
                return new BuildEntry_1.BagEntry(loc, parseExpr_1.default(rest()), true);
            case 29:
                return new Do_1.Ignore(loc, rest().map(parseLocalDeclares_1.parseLocalName));
            case 23:
                return new BuildEntry_1.BagEntry(loc, parseExpr_1.default(rest()));
            case 30:
                return Op_1.caseOp(parseExpr_1.opParseExpr(rest()), _ => new Do_1.Pass(tokens.loc, _), () => []);
            case 31:
                return new errors_1.Throw(loc, parseExpr_1.opParseExpr(rest()));
            case 32:
                return parseTraitDo_1.default(rest());
            default:
        }
        return Op_1.caseOp(tokens.opSplitOnce(Keyword_1.isLineSplitKeyword), _ref => {
            let before = _ref.before;
            let atToken = _ref.at;
            let after = _ref.after;

            const at = atToken;
            switch (at.kind) {
                case 22:
                    return new BuildEntry_1.MapEntry(loc, parseExpr_1.default(before), parseExpr_1.default(after));
                case 23:
                    return parseObjEntry(before, after, loc);
                case 21:
                    return parseMutate(before, after, loc);
                case 20:
                    return parseAssign(before, after, loc);
                default:
                    throw new Error(String(at.kind));
            }
        }, () => parseExpr_1.default(tokens));
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = parseLine;
    function parseLines(lines) {
        const lineContents = [];
        for (const line of lines.slices()) {
            const _ = parseLine(line);
            if (_ instanceof Array) lineContents.push(..._);else lineContents.push(_);
        }
        return lineContents;
    }
    exports.parseLines = parseLines;
    function parseMutate(before, after, loc) {
        const value = parseExpr_1.default(after);
        if (before.size() === 1) {
            const token = before.head();
            if (token instanceof Group_1.GroupSpace) {
                const spaced = Slice_1.Tokens.of(token);

                var _Op_1$caseOp = Op_1.caseOp(spaced.opSplitOnce(_ => Keyword_1.isKeyword(38, _)), _ref2 => {
                    let before = _ref2.before;
                    let after = _ref2.after;
                    return [before, parseExpr_1.default(after)];
                }, () => [spaced, null]);

                var _Op_1$caseOp2 = _slicedToArray(_Op_1$caseOp, 2);

                const assignee = _Op_1$caseOp2[0];
                const opType = _Op_1$caseOp2[1];

                const last = assignee.last();
                function object(obj) {
                    return obj.isEmpty() ? locals_1.LocalAccess.this(obj.loc) : parseSpaced_1.default(obj);
                }
                if (Keyword_1.isKeyword(41, assignee.nextToLast())) {
                    const name = parseMemberName_1.default(last);
                    const set = object(assignee.rtail().rtail());
                    return new Do_1.MemberSet(loc, set, name, opType, value);
                } else if (last instanceof Group_1.GroupBracket) {
                    const set = object(assignee.rtail());
                    const subbeds = parseExpr_1.parseExprParts(Slice_1.Tokens.of(last));
                    return new Do_1.SetSub(loc, set, subbeds, opType, value);
                }
            }
        }
        return parseLocalMutate(before, value, loc);
    }
    function parseObjEntry(before, after, loc) {
        if (before.size() === 1) {
            const token = before.head();
            const isName = token instanceof Keyword_1.KeywordSpecialVal && token.kind === 1;
            const value = () => parseExpr_1.default(after);
            if (after.isEmpty()) return isName ? BuildEntry_1.ObjEntryPlain.nameEntry(loc, new Val_1.SpecialVal(loc, 1)) : BuildEntry_1.ObjEntryPlain.access(loc, parseLocalDeclares_1.parseLocalName(token));else if (token instanceof Keyword_1.default) return new BuildEntry_1.ObjEntryPlain(loc, token.name(), value());else if (token instanceof Group_1.GroupQuote) return new BuildEntry_1.ObjEntryPlain(loc, parseQuote_1.default(Slice_1.default.of(token)), value());else if (token instanceof Group_1.GroupSpace) {
                const slice = Slice_1.Tokens.of(token);
                if (slice.size() === 2 && Keyword_1.isKeyword(58, slice.head())) {
                    const name = new Quote_1.QuoteSimple(loc, parseName_1.default(slice.second()));
                    return new BuildEntry_1.ObjEntryPlain(loc, name, value());
                }
            }
        }
        const assign = parseAssign(before, after, loc);
        return new BuildEntry_1.ObjEntryAssign(loc, assign);
    }
    function parseLocalMutate(localsTokens, value, loc) {
        const locals = parseLocalDeclares_1.parseLocalDeclaresJustNames(localsTokens);
        context_1.check(locals.length === 1, loc, _ => _.todoMutateDestructure);
        return new locals_1.LocalMutate(loc, locals[0].name, value);
    }
    function parseAssign(assigneeTokens, after, loc) {
        context_1.check(assigneeTokens.size() === 1, assigneeTokens.loc, _ => _.badAssignee);
        const assignee = assigneeTokens.head();
        const value = parseExpr_1.default(after);
        if (assignee instanceof Group_1.GroupBrace) {
            const locals = Slice_1.Tokens.of(assignee).map(parseLocalDeclares_1.parseLocalDeclare);
            return new locals_1.AssignDestructure(loc, locals, value);
        } else return new locals_1.AssignSingle(loc, parseLocalDeclares_1.parseLocalDeclare(assignee), value);
    }
    function parseAssert(negate, tokens) {
        checks_1.checkNonEmpty(tokens, _ => _.expectedAfterAssert);

        var _Op_1$caseOp3 = Op_1.caseOp(tokens.opSplitOnce(_ => Keyword_1.isKeyword(31, _)), _ref3 => {
            let before = _ref3.before;
            let after = _ref3.after;
            return [before, parseExpr_1.default(after)];
        }, () => [tokens, null]);

        var _Op_1$caseOp4 = _slicedToArray(_Op_1$caseOp3, 2);

        const condTokens = _Op_1$caseOp4[0];
        const opThrown = _Op_1$caseOp4[1];

        const parts = parseExpr_1.parseExprParts(condTokens);
        const cond = parts.length === 1 ? parts[0] : new Call_1.default(condTokens.loc, parts[0], util_1.tail(parts));
        return new errors_1.Assert(tokens.loc, negate, cond, opThrown);
    }
});
//# sourceMappingURL=parseLine.js.map
