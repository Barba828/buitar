import React, { FC, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'
import styles from './portal.module.scss'

const PortalInner: FC<{ container?: Element | null }> = (props) =>
	createPortal(props.children, props.container || document.body)

interface PortalProps {
	/**
	 * 触发元素
	 */
	trigger: React.ReactNode
	/**
	 * 触发条件
	 */
	triggerType?: 'click' | 'hover'
	/**
	 * 弹层默认可见
	 */
	defaultVisible?: boolean
	/**
	 * 弹层跟随trigger滚动
	 */
	followTrigger?: boolean
	/**
	 * 弹层容器
	 */
	container?: Element
	/**
	 * 弹层相对于trigger定位
	 */
	align?: 'right' | 'bottom'
}

export const Portal: FC<PortalProps> = ({
	trigger,
	children,
	container,
	triggerType = 'click',
	align = 'right',
	defaultVisible = false,
	followTrigger = true,
}) => {
	const ref = useRef<HTMLDivElement>(null)
	const portalRef = useRef<HTMLDivElement>(null)
	const [visible, setVisible] = useState<boolean>(!!defaultVisible)

	const handleClick = () => {
		triggerType === 'click' && setVisible(!visible)
	}
	const handleMouseOver = () => {
		triggerType === 'hover' && setVisible(true)
	}
	const handleMouseLeave = () => {
		triggerType === 'hover' && setVisible(false)
	}

	const portalStyle = useMemo(() => {
		switch (align) {
			case 'right':
				return { left: ref.current?.getBoundingClientRect().width + 'px' }
			case 'bottom':
				return { top: ref.current?.getBoundingClientRect().bottom + 'px' }
			default:
				return { left: ref.current?.getBoundingClientRect().width + 'px' }
		}
	}, [ref.current])

	return (
		<div ref={ref} className={styles['menu-container']}>
			<div onClick={handleClick} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
				{trigger}
			</div>
			{visible && ref.current && (
				<PortalInner container={container ? container : followTrigger ? ref.current : null}>
					<div
						ref={portalRef}
						className={cx(styles['menu-portal'], styles['show'])}
						style={portalStyle}
					>
						{children}
					</div>
				</PortalInner>
			)}
		</div>
	)
}
