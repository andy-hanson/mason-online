(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports);if (v !== undefined) module.exports = v;
    } else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'esast/lib/Expression', 'esast/lib/Literal', 'esast/lib/Statement', 'esast-create-util/lib/util', '../ast/BuildEntry', '../ast/locals', '../util', './context', './esast-constants', './ms', './transpileDo', './transpileLocals', './transpileMemberName', './transpileModule', './transpileVal'], factory);
    }
})(function (require, exports) {
    "use strict";

    const Expression_1 = require('esast/lib/Expression');
    const Literal_1 = require('esast/lib/Literal');
    const Statement_1 = require('esast/lib/Statement');
    const util_1 = require('esast-create-util/lib/util');
    const BuildEntry_1 = require('../ast/BuildEntry');
    const locals_1 = require('../ast/locals');
    const util_2 = require('../util');
    const context_1 = require('./context');
    const esast_constants_1 = require('./esast-constants');
    const ms_1 = require('./ms');
    const transpileDo_1 = require('./transpileDo');
    const transpileLocals_1 = require('./transpileLocals');
    const transpileMemberName_1 = require('./transpileMemberName');
    const transpileModule_1 = require('./transpileModule');
    const transpileVal_1 = require('./transpileVal');
    function transpileBuildEntryNoLoc(_) {
        if (_ instanceof BuildEntry_1.BagEntry) {
            const isMany = _.isMany;
            const value = _.value;

            return new Statement_1.ExpressionStatement(ms_1.msCall(isMany ? 'addMany' : 'add', esast_constants_1.idBuilt, transpileVal_1.default(value)));
        } else if (_ instanceof BuildEntry_1.MapEntry) {
            const key = _.key;
            const val = _.val;

            return new Statement_1.ExpressionStatement(ms_1.msCall('setSub', esast_constants_1.idBuilt, transpileVal_1.default(key), transpileVal_1.default(val)));
        } else if (_ instanceof BuildEntry_1.ObjEntryAssign) {
            const assign = _.assign;

            if (assign instanceof locals_1.AssignSingle && !assign.assignee.isLazy) {
                const name = assign.assignee.name;
                return transpileLocals_1.transpileAssignSingleNoLoc(assign, val => context_1.verifyResults.isObjEntryExport(_) ? transpileModule_1.exportNamedOrDefault(val, name) : new Expression_1.AssignmentExpression('=', util_1.member(esast_constants_1.idBuilt, name), val));
            } else {
                const assigns = assign.allAssignees().map(_ => new Statement_1.ExpressionStatement(ms_1.msCall('setLazy', esast_constants_1.idBuilt, new Literal_1.LiteralString(_.name), transpileLocals_1.idForDeclareCached(_))));
                return util_2.cat(transpileDo_1.default(assign), assigns);
            }
        } else if (_ instanceof BuildEntry_1.ObjEntryPlain) {
            const name = _.name;
            const value = _.value;

            const val = transpileVal_1.default(value);
            return new Statement_1.ExpressionStatement(context_1.verifyResults.isObjEntryExport(_) ? transpileModule_1.exportNamedOrDefault(val, name) : new Expression_1.AssignmentExpression('=', transpileMemberName_1.transpileMember(esast_constants_1.idBuilt, name), val));
        } else throw new Error(_.constructor.name);
    }
    exports.transpileBuildEntryNoLoc = transpileBuildEntryNoLoc;
});
//# sourceMappingURL=transpileBuildEntry.js.map
