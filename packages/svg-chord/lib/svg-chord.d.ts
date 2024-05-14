export type SvgChordPoint = {
	/**
	 * 品 -1代表该弦不发声
	 */
	fret: number
    /**
     * 弦 1开始 比如吉他 1～6
     */
	string: number
    /**
     * 音 名
     */
	tone?: string
	color?: string
}