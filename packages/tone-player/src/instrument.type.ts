/**弦乐器 */
export type StringsInstrument =
	| 'bass-electric'
	| 'guitar-acoustic'
	| 'guitar-electric'
	| 'guitar-nylon'
	| 'piano'
	| 'ukulele'
	| 'default' // 合成音

/**鼓乐器 */
export type PercussionInstrument = 'drum' | 'drum-acounstic' | 'drum-electronic' | 'metronome'

export type Instrument = StringsInstrument | PercussionInstrument
