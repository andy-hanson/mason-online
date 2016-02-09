import Block from '../ast/Block'
import {LocalDeclare} from '../ast/locals'
import {check} from '../context'
import {isEmpty, last, rtail} from '../util'
import {Blocks} from '../VerifyResults'
import autoBlockKind from './autoBlockKind'
import {results} from './context'
import SK from './SK'
import verifyLines, {verifyBuiltLines} from './verifyLines'
import {plusLocals} from './verifyLocals'
import {ensureValAndVerify} from './verifyVal'

export function verifyBlockSK(_: Block, sk: SK): void {
	if (sk === SK.Do)
		verifyBlockDo(_)
	else
		verifyBlockVal(_)
}

export function verifyBlockVal(_: Block): void {
	const {lines, loc} = _
	check(!isEmpty(lines), loc, _ => _.blockNeedsContent)
	const kind = autoBlockKind(lines, loc)
	switch (kind) {
		case Blocks.Bag: case Blocks.Map: case Blocks.Obj:
			verifyBuiltLines(lines, loc)
			break
		case Blocks.Throw:
			verifyLines(lines)
			break
		case Blocks.Return:
			plusLocals(verifyLines(rtail(lines)), () => ensureValAndVerify(last(lines)))
			break
		default:
			throw new Error(String(kind))
	}
	results.blockToKind.set(_, kind)
}

export function verifyBlockDo(_: Block): Array<LocalDeclare> {
	results.blockToKind.set(_, Blocks.Do)
	return verifyLines(_.lines)
}
