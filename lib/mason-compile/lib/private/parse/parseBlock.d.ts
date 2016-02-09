import Op from 'op/Op';
import Block, { BlockWrap } from '../ast/Block';
import { Kw } from '../token/Keyword';
import { Lines, Tokens } from './Slice';
export default function parseBlock(lineTokens: Lines): Block;
export declare function beforeAndBlock(tokens: Tokens): [Tokens, Lines];
export declare function beforeAndOpBlock(tokens: Tokens): [Tokens, Op<Lines>];
export declare function parseBlockWrap(tokens: Lines): BlockWrap;
export declare function justBlock(keywordKind: Kw, tokens: Tokens): Lines;
export declare function parseJustBlock(keywordKind: Kw, tokens: Tokens): Block;
