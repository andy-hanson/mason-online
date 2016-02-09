import Loc from 'esast/lib/Loc'
import Op, {caseOp} from 'op/Op'
import {BagEntry, MapEntry, ObjEntry, ObjEntryAssign, ObjEntryPlain} from '../ast/BuildEntry'
import Call from '../ast/Call'
import {Ignore, MemberSet, Pass, SetSub, SpecialDo, SpecialDos} from '../ast/Do'
import {Assert, Throw} from '../ast/errors'
import LineContent, {Do, Val} from '../ast/LineContent'
import {Assign, AssignSingle, AssignDestructure, LocalAccess, LocalMutate} from '../ast/locals'
import {Break} from '../ast/Loop'
import {QuoteSimple} from '../ast/Quote'
import {SpecialVal, SpecialVals} from '../ast/Val'
import {check} from '../context'
import {GroupBrace, GroupBracket, GroupQuote, GroupSpace} from '../token/Group'
import Keyword, {isKeyword, isLineSplitKeyword, isLineStartKeyword, KeywordComment, KeywordPlain,
	KeywordSpecialVal, Kw} from '../token/Keyword'
import Token from '../token/Token'
import {assert, tail} from '../util'
import {checkEmpty, checkNonEmpty} from './checks'
import {justBlock} from './parseBlock'
import parseExpr, {opParseExpr, parseExprParts} from './parseExpr'
import {parseLocalDeclare, parseLocalDeclaresJustNames, parseLocalName} from './parseLocalDeclares'
import parseMemberName from './parseMemberName'
import parseName from './parseName'
import parseQuote from './parseQuote'
import parseSpaced from './parseSpaced'
import parseTraitDo from './parseTraitDo'
import Slice, {Lines, Tokens} from './Slice'

/** Parse the content of a line. */
export default function parseLine(tokens: Tokens): LineContent | Array<LineContent> {
	const loc = tokens.loc
	const head = tokens.head()
	const rest = () => tokens.tail()

	const noRest = () => {
		checkEmpty(rest(), _ => _.unexpectedAfter(head))
	}

	if (head instanceof KeywordComment) {
		assert(head.kind === 'region')
		return parseLines(justBlock(Kw.Region, rest()))
	}

	// We only deal with mutable expressions here, otherwise we fall back to parseExpr.
	if (isLineStartKeyword(head))
		switch (head.kind) {
			case Kw.Assert: case Kw.Forbid:
				return parseAssert(head.kind === Kw.Forbid, rest())
			case Kw.Break:
				return new Break(loc, opParseExpr(rest()))
			case Kw.Debugger:
				noRest()
				return new SpecialDo(loc, SpecialDos.Debugger)
			case Kw.Dot3:
				return new BagEntry(loc, parseExpr(rest()), true)
			case Kw.Ignore:
				return new Ignore(loc, rest().map(parseLocalName))
			case Kw.ObjEntry:
				return new BagEntry(loc, parseExpr(rest()))
			case Kw.Pass:
				return caseOp<Val, LineContent | Array<LineContent>>(
					opParseExpr(rest()), _ => new Pass(tokens.loc, _), () => [])
			case Kw.Throw:
				return new Throw(loc, opParseExpr(rest()))
			case Kw.TraitDo:
				return parseTraitDo(rest())
			default:
				// fall through
		}

	return caseOp<{before: Tokens, at: Token, after: Tokens}, LineContent>(
		tokens.opSplitOnce(isLineSplitKeyword),
		({before, at: atToken, after}) => {
			const at = <KeywordPlain> atToken
			switch (at.kind) {
				case Kw.MapEntry:
					return new MapEntry(loc, parseExpr(before), parseExpr(after))
				case Kw.ObjEntry:
					return parseObjEntry(before, after, loc)
				case Kw.AssignMutate:
					return parseMutate(before, after, loc)
				case Kw.Assign:
					return parseAssign(before, after, loc)
				default:
					throw new Error(String(at.kind))
			}
		},
		() => parseExpr(tokens))
}

export function parseLines(lines: Lines): Array<LineContent> {
	const lineContents: Array<LineContent> = []
	for (const line of lines.slices()) {
		const _ = parseLine(line)
		if (_ instanceof Array)
			lineContents.push(..._)
		else
			lineContents.push(_)
	}
	return lineContents
}

function parseMutate(before: Tokens, after: Tokens, loc: Loc): Do {
	const value = parseExpr(after)
	if (before.size() === 1) {
		const token = before.head()
		if (token instanceof GroupSpace) {
			const spaced = Tokens.of(token)
			const [assignee, opType] = caseOp<{before: Tokens, after: Tokens}, [Tokens, Op<Val>]>(
				spaced.opSplitOnce(_ => isKeyword(Kw.Colon, _)),
				({before, after}) => [before, parseExpr(after)],
				() => [spaced, null])

			const last = assignee.last()
			function object(obj: Tokens): Val {
				return obj.isEmpty() ? LocalAccess.this(obj.loc) : parseSpaced(obj)
			}

			if (isKeyword(Kw.Dot, assignee.nextToLast())) {
				const name = parseMemberName(last)
				const set = object(assignee.rtail().rtail())
				return new MemberSet(loc, set, name, opType, value)
			} else if (last instanceof GroupBracket) {
				const set = object(assignee.rtail())
				const subbeds = parseExprParts(Tokens.of(last))
				return new SetSub(loc, set, subbeds, opType, value)
			}
		}
	}
	return parseLocalMutate(before, value, loc)
}

function parseObjEntry(before: Tokens, after: Tokens, loc: Loc): ObjEntry {
	if (before.size() === 1) {
		const token = before.head()
		const isName = token instanceof KeywordSpecialVal && token.kind === SpecialVals.Name
		const value = () => parseExpr(after)

		// Handle `a.` which moves an outer local into an ObjEntry.
		if (after.isEmpty())
			return isName ?
				ObjEntryPlain.nameEntry(loc, new SpecialVal(loc, SpecialVals.Name)) :
				ObjEntryPlain.access(loc, parseLocalName(token))
		else if (token instanceof Keyword)
			return new ObjEntryPlain(loc, token.name(), value())
		// `"1". 1`
		else if (token instanceof GroupQuote)
			return new ObjEntryPlain(loc, parseQuote(Slice.of(token)), value())
		// 'foo. 1
		else if (token instanceof GroupSpace) {
			const slice = Tokens.of(token)
			if (slice.size() === 2 && isKeyword(Kw.Tick, slice.head())) {
				const name = new QuoteSimple(loc, parseName(slice.second()))
				return new ObjEntryPlain(loc, name, value())
			}
		}
	}

	const assign = parseAssign(before, after, loc)
	return new ObjEntryAssign(loc, assign)
}

function parseLocalMutate(localsTokens: Tokens, value: Val, loc: Loc): LocalMutate {
	const locals = parseLocalDeclaresJustNames(localsTokens)
	check(locals.length === 1, loc, _ => _.todoMutateDestructure)
	return new LocalMutate(loc, locals[0].name, value)
}

function parseAssign(assigneeTokens: Tokens, after: Tokens, loc: Loc): Assign {
	check(assigneeTokens.size() === 1, assigneeTokens.loc, _ => _.badAssignee)
	const assignee = assigneeTokens.head()
	const value = parseExpr(after)
	if (assignee instanceof GroupBrace) {
		const locals = Tokens.of(assignee).map(parseLocalDeclare)
		return new AssignDestructure(loc, locals, value)
	} else
		return new AssignSingle(loc, parseLocalDeclare(assignee), value)
}

function parseAssert(negate: boolean, tokens: Tokens): Assert {
	checkNonEmpty(tokens, _ => _.expectedAfterAssert)
	const [condTokens, opThrown] = caseOp<{before: Tokens, after: Tokens}, [Tokens, Op<Val>]>(
		tokens.opSplitOnce(_ => isKeyword(Kw.Throw, _)),
		({before, after}) => [before, parseExpr(after)],
		() => [tokens, null])
	const parts = parseExprParts(condTokens)
	const cond = parts.length === 1 ? parts[0] : new Call(condTokens.loc, parts[0], tail(parts))
	return new Assert(tokens.loc, negate, cond, opThrown)
}
