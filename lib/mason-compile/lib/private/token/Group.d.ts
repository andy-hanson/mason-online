import Loc from 'esast/lib/Loc';
import Keyword from './Keyword';
import Token, { NameToken, StringToken } from './Token';
declare abstract class Group<SubType extends Token> extends Token {
    subTokens: Array<SubType>;
    constructor(loc: Loc, subTokens: Array<SubType>);
    type: GroupType;
}
export default Group;
export declare type GroupType = {
    new (loc: Loc, subTokens: Array<{}>): Group<Token>;
};
export declare class GroupBlock extends Group<GroupLine> {
}
export declare type QuoteTokenPart = StringToken | NameToken | Keyword | GroupInterpolation;
export declare class GroupQuote extends Group<QuoteTokenPart> {
}
export declare class GroupRegExp extends Group<QuoteTokenPart> {
    flags: string;
}
export declare class GroupParenthesis extends Group<Token> {
}
export declare class GroupBracket extends Group<Token> {
}
export declare class GroupBrace extends Group<Token> {
}
export declare class GroupLine extends Group<Token> {
    showType(): string;
}
export declare class GroupSpace extends Group<Token> {
    showType(): string;
}
export declare class GroupInterpolation extends Group<Token> {
    showType(): string;
}
