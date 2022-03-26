import React, { FC } from 'react'
import { FifthsCircle } from '@/components/fifths-circle'
import { ToneSchema, ModeType } from 'to-guitar'
import cx from 'classnames'
import { useBoardContext } from '@/components'

import styles from './fifth-circle-controller.module.scss'

export const FifthCircleController: FC<{ className?: string }> = (props) => {
	const { guitar } = useBoardContext()

	const handleClickFifths = ({ tone, mode }: { tone: ToneSchema; mode: ModeType }) => {
		if (!tone) {
			return
		}
		guitar.setOptions({ mode, scale: tone.note })
	}

	return (
		<FifthsCircle
			{...props}
			size={280}
			thin={50}
			onClick={handleClickFifths}
			className={cx('buitar-primary-button', styles['fifth-circle'], props.className)}
		/>
	)
}
