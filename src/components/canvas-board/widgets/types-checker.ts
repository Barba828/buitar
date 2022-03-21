import { ToneTypeName } from 'to-guitar'
export const typesChecker = (callback?: (ToneTypeName: ToneTypeName) => void) => {
	let isNote = true
	let isSharpSemitone = true

	const isNotes = document.getElementsByName('is-note')
	const isRisings = document.getElementsByName('is-rising')

	const getTypes = () => {
		return (
			isNote
				? isSharpSemitone
					? 'note'
					: 'noteFalling'
				: isSharpSemitone
				? 'interval'
				: 'intervalFalling'
		) as ToneTypeName
	}

	if (isNotes) {
		isNotes.forEach((type, index) => {
			type.addEventListener('click', () => {
				const temp = index === 0
				if (isNote !== temp) {
					isNote = temp
					callback?.(getTypes())
				}
			})
		})
	}

	if (isRisings) {
		isRisings.forEach((type, index) => {
			type.addEventListener('click', () => {
				const temp = index === 0
				if (isSharpSemitone !== temp) {
					isSharpSemitone = temp
					callback?.(getTypes())
				}
			})
		})
	}
}
