import Loc from 'esast/lib/Loc';
import Op from 'op/Op';
import Block from './Block';
import { Val, ValOnly } from './LineContent';
import { Operators, UnaryOperators } from './Val';
import { LocalDeclare } from './locals';
import MemberName from './MemberName';
import Named from './Named';
declare abstract class Fun extends ValOnly {
    isFun(): void;
}
export default Fun;
export declare class FunBlock extends Fun implements Named {
    args: Array<LocalDeclare>;
    opRestArg: Op<LocalDeclare>;
    block: Block;
    kind: Funs;
    opDeclareThis: Op<LocalDeclare>;
    isDo: boolean;
    opReturnType: Op<Val>;
    constructor(loc: Loc, args: Array<LocalDeclare>, opRestArg: Op<LocalDeclare>, block: Block, opts?: FunBlockOptions);
    isNamed(): void;
}
export declare const enum Funs {
    Plain = 0,
    Async = 1,
    Generator = 2,
}
export declare type FunBlockOptions = {
    kind?: Funs;
    isThisFun?: boolean;
    isDo?: boolean;
    opReturnType?: Op<Val>;
};
export declare class FunMember extends Fun {
    opObject: Op<Val>;
    name: MemberName;
    constructor(loc: Loc, opObject: Op<Val>, name: MemberName);
}
export declare class FunGetter extends Fun {
    name: MemberName;
    constructor(loc: Loc, name: MemberName);
}
export declare class FunOperator extends Fun {
    kind: Operators;
    constructor(loc: Loc, kind: Operators);
}
export declare class FunUnary extends Fun {
    kind: UnaryOperators;
    constructor(loc: Loc, kind: UnaryOperators);
}
export declare class FunSimple extends Fun {
    value: Val;
    constructor(loc: Loc, value: Val);
}
