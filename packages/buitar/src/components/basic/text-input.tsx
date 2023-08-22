import React, { FC, useState } from 'react'
import cx from 'classnames'
import { Icon } from '../icon'

import styles from './text-input.module.scss'

export const AddTextInput: FC<{
	onConfirm?: (text: string) => void
	placeholder?: string
	className?: string
}> = ({ onConfirm, placeholder = '...', className }) => {
	const [isInput, setIsInput] = useState<boolean>(false)
	const [name, setName] = useState<string>('')

	const handleClick = () => {
		setIsInput(!isInput)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
	}

	const handleConfirm = () => {
		setIsInput(false)
		onConfirm?.(name)
	}

	const add = (
		<div
			onClick={handleClick}
			className={cx('primary-button', styles['type-item'], className)}
		>
			<Icon name="icon-add" />
		</div>
	)

	const input = (
		<>
			<input
				placeholder={placeholder}
				onChange={handleChange}
				className={cx('primary-button', styles['type-input'])}
			></input>
			<div className={cx(styles['type-input-controller'])}>
				<div
					onClick={handleClick}
					className={cx('primary-button', styles['type-input-item'])}
				>
					<Icon name="icon-back" size={14} />
				</div>
				{name.length > 0 && (
					<div
						onClick={handleConfirm}
						className={cx('primary-button', styles['type-input-item'])}
					>
						<Icon name="icon-confirm" />
					</div>
				)}
			</div>
		</>
	)
	return isInput ? input : add
}
