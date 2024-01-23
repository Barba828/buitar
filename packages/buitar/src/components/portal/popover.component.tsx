import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPopper, type Options as PopperOptions } from '@popperjs/core'
import { PortalInner } from './portal.component'
import styles from './popover.module.scss'
import cx from 'classnames'
import { useIsHoverable } from '@/utils/hooks/use-device'

interface PopoverProps extends Partial<PopperOptions> {
	trigger: React.ReactNode
	children: React.ReactNode
	appendToBody?: boolean
	containerClass?: string
}

export const Popover: React.FC<PopoverProps> = ({
	trigger,
	children,
	appendToBody = true,
	containerClass,
	...popperOptions
}) => {
	const isHover = useIsHoverable()
	const [isVisible, setIsVisible] = useState(false)
	const triggerRef = useRef<HTMLDivElement | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (triggerRef.current && containerRef.current) {
			const popperInstance = createPopper(triggerRef.current, containerRef.current, popperOptions)

			return () => {
				popperInstance.destroy()
			}
		}
	}, [triggerRef.current, containerRef.current, popperOptions])

	const handleTogglePopover = useCallback(() => {
		setIsVisible(!isVisible)
	}, [isVisible])

	const content = (
		<>
			{/* 遮罩层 */}
			{isVisible && <div className={cx('overlay')} onClickCapture={handleTogglePopover}></div>}
			{/* 内容 */}
			<div ref={containerRef} className={cx('fade-in', styles['popover'], containerClass)}>
				{isVisible && children}
			</div>
		</>
	)

	return (
		<>
			<div
				ref={triggerRef}
				onClick={handleTogglePopover}
				onMouseEnter={() => isHover && setIsVisible(true)}
			>
				{trigger}
			</div>
			{appendToBody ? isVisible && <PortalInner>{content}</PortalInner> : content}
		</>
	)
}
