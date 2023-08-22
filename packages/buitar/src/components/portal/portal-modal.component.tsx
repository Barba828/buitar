import { FC, ReactNode, useEffect } from 'react'
import { PortalInner } from './portal.component'
import { Icon } from '@/components/icon'
import styles from './portal-modal.module.scss'
import cx from 'classnames'

export interface ModalProps {
	visible?: boolean
	pure?: boolean
	title?: ReactNode
	onCancel?: React.MouseEventHandler<HTMLDivElement>
	onConfirm?: React.MouseEventHandler<HTMLDivElement>
}

export const Modal: FC<ModalProps> = ({ visible, pure, title, children, onConfirm, onCancel }) => {
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
			<div className="modal flex-center">
				{pure ? (
					children
				) : (
					<div className={styles['modal-container']}>
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
