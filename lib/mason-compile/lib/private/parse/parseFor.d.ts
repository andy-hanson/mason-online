import { For, ForAsync, ForBag } from '../ast/Loop';
import { Tokens } from './Slice';
export declare function parseFor(tokens: Tokens): For;
export declare function parseForAsync(tokens: Tokens): ForAsync;
export declare function parseForBag(tokens: Tokens): ForBag;
