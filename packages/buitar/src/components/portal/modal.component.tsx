import { FC, ReactNode, useEffect } from 'react'
import { PortalInner } from './portal.component'
import { Icon } from '@/components/icon'
import styles from './modal.module.scss'
import cx from 'classnames'

export interface ModalProps {
	visible?: boolean
	/**
	 * 无children容器
	 */
	pure?: boolean
	/**
	 * 点击浮层onCancel
	 */
	closeOnOverlay?: boolean
	title?: ReactNode
	onCancel?: React.MouseEventHandler<HTMLDivElement>
	onConfirm?: React.MouseEventHandler<HTMLDivElement>
	containerClass?: string
}

export const Modal: FC<ModalProps> = ({
	visible,
	pure,
	title,
	children,
	onConfirm,
	onCancel,
	containerClass,
	closeOnOverlay = true,
}) => {
	useEffect(() => {
		const container = document.body
		if (visible) {
			container.style.overflow = 'hidden'
		} else {
			container.style.overflow = 'auto'
		}
		return () => {
			container.style.overflow = 'auto'
		}
	}, [visible])

	if (!visible) {
		return null
	}

	return (
		<PortalInner>
			<div
				className={cx('overlay flex-center fade-in', styles['modal-overlay'])}
				onClick={closeOnOverlay ? onCancel : undefined}
			>
				{pure ? (
					children
				) : (
					<div
						onClick={(e) => e.stopPropagation()}
						className={cx(styles['modal-container'], containerClass)}
					>
						{typeof title == 'string' ? (
							<div className={styles['modal-title']}>{title}</div>
						) : (
							title
						)}

						{children}

						<div className={styles['modal-options']}>
							<div className={cx('primary-button', 'flex-center')} onClick={onCancel}>
								<Icon name="icon-close" />
							</div>
							<div
								className={cx('primary-button', 'touch-yellow ', 'flex-center')}
								onClick={onConfirm}
							>
								<Icon name="icon-confirm" />
							</div>
						</div>
					</div>
				)}
			</div>
		</PortalInner>
	)
}
