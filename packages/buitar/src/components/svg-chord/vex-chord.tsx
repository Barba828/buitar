import { useIsMobile } from '@/utils/hooks/use-device'
import { Point } from '@buitar/to-guitar'
import { FC, memo, useEffect, useRef } from 'react'
import { Voice, StaveNote, Formatter, Flow } from 'vexflow/core'
import cx from 'classnames'
import styles from './vex-chord.module.scss'

const { Renderer, Stave } = Flow
export const VexChord: FC<{ taps: Point[]; className?: string }> = memo(({ taps, className }) => {
	const divRef = useRef<HTMLDivElement>()
	const isMobile = useIsMobile()
	const chordWidth = isMobile ? 160 : 200
	const chordHeight = 140

	if (!taps) {
		return null
	}

	useEffect(() => {
		if (!divRef.current) {
			return
		}
		if (!taps.length) {
			return
		}

		divRef.current.innerHTML = ''

		// 定义谱线
		const renderer = new Renderer(divRef.current, Renderer.Backends.SVG)
		renderer.resize(chordWidth, chordHeight)
		// 画板ctx
		const context = renderer.getContext()
		context.setFillStyle('#FF00FF')
		context.setStrokeStyle('#FFFF00')
		const stave = new Stave(5, 20, chordWidth - 10, { space_above_staff_ln: 3 })
		// 渲染高音谱
		stave.addClef('treble')
		stave.setContext(context).draw()

		// 生成音符
		const notes = taps
			.sort((tapA, tapB) => tapA.string - tapB.string)
			.map((tap) => {
				const key = `${tap.toneSchema.note}/${Number(tap.toneSchema.level) + 1}`
				return new StaveNote({ keys: [key], duration: 'q' })
			})

		// 音符拍号
		const voice = new Voice({ num_beats: notes.length, beat_value: 4 })
		voice.addTickables(notes)

		// 音符整理对齐
		new Formatter().joinVoices([voice]).format([voice], chordWidth * 0.6)
		// 渲染音符
		voice.draw(context, stave)
	}, [divRef.current, taps])

	return <div className={cx(styles['vex-chord'] ,className, 'primary-button', 'flex-center')} ref={divRef as any} />
})
