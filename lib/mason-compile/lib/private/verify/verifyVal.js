(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports);if (v !== undefined) module.exports = v;
    } else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'op/Op', '../context', '../ast/Block', '../ast/Call', '../ast/Class', '../ast/Fun', '../ast/LineContent', '../ast/locals', '../ast/Loop', '../ast/Poly', '../ast/Trait', '../ast/Quote', '../ast/Val', './context', './util', './verifyBlock', './verifyCall', './verifyClass', './verifyFun', './verifyLocals', './verifyLoop', './verifyMemberName', './verifyPoly', './verifyQuote', './verifyTrait', './verifyValOrDo'], factory);
    }
})(function (require, exports) {
    "use strict";

    const Op_1 = require('op/Op');
    const context_1 = require('../context');
    const Block_1 = require('../ast/Block');
    const Call_1 = require('../ast/Call');
    const Class_1 = require('../ast/Class');
    const Fun_1 = require('../ast/Fun');
    const LineContent_1 = require('../ast/LineContent');
    const locals_1 = require('../ast/locals');
    const Loop_1 = require('../ast/Loop');
    const Poly_1 = require('../ast/Poly');
    const Trait_1 = require('../ast/Trait');
    const Quote_1 = require('../ast/Quote');
    const Val_1 = require('../ast/Val');
    const context_2 = require('./context');
    const util_1 = require('./util');
    const verifyBlock_1 = require('./verifyBlock');
    const verifyCall_1 = require('./verifyCall');
    const verifyClass_1 = require('./verifyClass');
    const verifyFun_1 = require('./verifyFun');
    const verifyLocals_1 = require('./verifyLocals');
    const verifyLoop_1 = require('./verifyLoop');
    const verifyMemberName_1 = require('./verifyMemberName');
    const verifyPoly_1 = require('./verifyPoly');
    const verifyQuote_1 = require('./verifyQuote');
    const verifyTrait_1 = require('./verifyTrait');
    const verifyValOrDo_1 = require('./verifyValOrDo');
    function verifyVal(_) {
        if (_ instanceof Val_1.BagSimple) verifyCall_1.verifyEachValOrSpread(_.parts);else if (_ instanceof Block_1.BlockWrap) context_2.withIife(() => verifyBlock_1.verifyBlockVal(_.block));else if (_ instanceof Class_1.default) verifyClass_1.default(_);else if (_ instanceof Loop_1.ForBag) verifyLocals_1.verifyAndPlusLocal(_.built, () => verifyLoop_1.default(_, 1));else if (_ instanceof Fun_1.default) verifyFun_1.default(_);else if (_ instanceof Val_1.InstanceOf) {
            const instance = _.instance;
            const type = _.type;

            verifyVal(instance);
            verifyVal(type);
        } else if (_ instanceof Val_1.Lazy) verifyLocals_1.withBlockLocals(() => verifyVal(_.value));else if (_ instanceof locals_1.LocalAccess) verifyLocals_1.verifyLocalAccess(_);else if (_ instanceof Val_1.Member) {
            const object = _.object;
            const name = _.name;

            verifyVal(object);
            verifyMemberName_1.default(name);
        } else if (_ instanceof Quote_1.MsRegExp) verifyQuote_1.verifyRegExp(_);else if (_ instanceof Call_1.New) verifyCall_1.verifyNew(_);else if (_ instanceof Val_1.NumberLiteral) {} else if (_ instanceof Val_1.ObjSimple) {
            const keys = new Set();
            for (const _ref of _.pairs) {
                const key = _ref.key;
                const value = _ref.value;
                const loc = _ref.loc;

                if (typeof key === 'string') {
                    context_1.check(!keys.has(key), loc, _ => _.duplicateKey(key));
                    keys.add(key);
                } else verifyVal(key);
                verifyVal(value);
            }
        } else if (_ instanceof Val_1.Operator) {
            const args = _.args;
            const loc = _.loc;

            context_1.check(args.length > 1, loc, _ => _.argsOperator(args.length));
            verifyEachVal(_.args);
        } else if (_ instanceof Val_1.Pipe) {
            const loc = _.loc;
            const startValue = _.startValue;
            const pipes = _.pipes;

            verifyVal(startValue);
            for (const pipe of pipes) verifyLocals_1.registerAndPlusLocal(locals_1.LocalDeclare.focus(loc), () => {
                verifyVal(pipe);
            });
        } else if (_ instanceof Poly_1.default) verifyPoly_1.default(_);else if (_ instanceof Quote_1.default) verifyQuote_1.default(_);else if (_ instanceof Quote_1.QuoteTagged) verifyQuote_1.verifyQuoteTagged(_);else if (_ instanceof Val_1.Range) {
            const start = _.start;
            const opEnd = _.opEnd;

            verifyVal(start);
            verifyOpVal(opEnd);
        } else if (_ instanceof Val_1.SpecialVal) {
            if (_.kind === 1) util_1.setName(_);
        } else if (_ instanceof Val_1.Sub) {
            const subbed = _.subbed;
            const args = _.args;

            verifyVal(subbed);
            verifyEachVal(args);
        } else if (_ instanceof Class_1.SuperMember) verifyClass_1.verifySuperMember(_);else if (_ instanceof Trait_1.default) verifyTrait_1.default(_);else if (_ instanceof Val_1.UnaryOperator) verifyVal(_.arg);else verifyValOrDo_1.default(_, 1);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = verifyVal;
    function ensureValAndVerify(_) {
        if (LineContent_1.isVal(_)) verifyVal(_);else throw context_1.fail(_.loc, _ => _.statementAsValue);
    }
    exports.ensureValAndVerify = ensureValAndVerify;
    function verifyOpVal(_) {
        if (Op_1.nonNull(_)) verifyVal(_);
    }
    exports.verifyOpVal = verifyOpVal;
    function verifyEachVal(vals) {
        for (const _ of vals) verifyVal(_);
    }
    exports.verifyEachVal = verifyEachVal;
});
//# sourceMappingURL=verifyVal.js.map
