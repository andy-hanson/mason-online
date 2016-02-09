import CompileError from '../../CompileError';
import Language from '../languages/Language';
import { Kw } from '../token/Keyword';
import Token from '../token/Token';
import Slice from './Slice';
export declare function checkEmpty(tokens: Slice<Token>, message: (_: Language) => string): void;
export declare function checkNonEmpty(tokens: Slice<Token>, message: (_: Language) => string): void;
export declare function checkKeyword(keyword: Kw, token: Token): void;
export declare function unexpected(token: Token): CompileError;
