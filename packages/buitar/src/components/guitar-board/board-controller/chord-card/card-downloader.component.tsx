import { ModalProps, SvgChordProps, Modal, SvgChord, RangeSlider, TabSwitch, toast } from '@/components'
import { FC, useRef, useState } from 'react'
import { downloadSvgToImg, downloadSVG } from '@/utils/download'
import cx from 'classnames'

import styles from './chord-card.module.scss'

export const CardDownloader: FC<
	{
		className?: string
	} & Partial<ModalProps> &
		SvgChordProps
> = ({ className, points, title, onCancel ,...restProps }) => {
	const [downloadTitle, setDownloadTitle] = useState(title || 'buitar_chord')
	const [color, setColor] = useState('#ffffff')
	const [downloadRate, setDownloadRate] = useState(3)
	const [downloadType, setDownloadType] = useState('png')
	const svgRef = useRef<SVGSVGElement>(null)

	const handleConfirm = (e: any) => {
		if (!svgRef.current) {
			return
		}

        const filename = `buitar_chord_${downloadTitle}`
		if (downloadType === 'png') {
			downloadSvgToImg(svgRef.current, filename, downloadRate)
		} else {
			downloadSVG(svgRef.current, filename)
		}
		onCancel?.(e)
        toast('下载成功')
	}

	const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDownloadTitle(e.target.value)
	}
	const handleChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
		setColor(e.target.value)
	}
	return (
		<Modal {...restProps} onConfirm={handleConfirm} title="下载设置">
			<div className={styles['download-container']}>
				<div className="">
					<div className="flex">
						<TabSwitch
							values={['png', 'svg']}
							defaultValue={downloadType}
							className={styles['download-option-switch']}
							onChange={(type) => setDownloadType(type)}
						/>
					</div>

					<div className="flex">
						<div className={cx('touch-primary', styles['download-desc'])}>颜色{color}</div>
						<input
							type="color"
							value={color}
							onChange={handleChangeColor}
							className={cx('buitar-primary-button', 'color-input')}
						/>
					</div>

					<div className="flex">
						<div className={cx('touch-primary', styles['download-desc'])}>名称</div>
						<input
							placeholder="名称"
							value={downloadTitle}
							onChange={handleChangeTitle}
							className={cx('buitar-primary-button', 'text-input', styles['download-option-item'])}
						></input>
					</div>

					<div className="flex">
						<div className={cx('touch-primary', styles['download-desc'])}>
							尺寸{downloadRate}倍
						</div>
						<RangeSlider
							range={[1, 5]}
							inputClassName={styles['download-option-item']}
							defaultValue={downloadRate}
							onChange={([_, size]) => {
								setDownloadRate(size)
							}}
						/>
					</div>
				</div>
				<div className={cx(styles['download-preview'], 'flex-center')}>
					<SvgChord ref={svgRef} points={points} size={160} color={color} title={downloadTitle} />
				</div>
			</div>
		</Modal>
	)
}
