import { OnChange } from '../utils/on-change.js'

interface DrawableOptions {
	/**
	 * canvas绘制上下文
	 */
	ctx: CanvasRenderingContext2D
	/**
	 * 可绘制图形 x 轴位置
	 */
	x?: number
	/**
	 * 可绘制图形 y 轴位置
	 */
	y?: number
	/**
	 * 绘制Method
	 */
	draw(): void
	/**
	 * 鼠标是否在绘制内容内
	 * @param args
	 */
	isOver?(...args: any): boolean
}

class Drawable<T> implements DrawableOptions {
	// options: { [x: string]: any } = {}
	readonly options: T = OnChange({} as T, () => {
		this.draw()
	})
	ctx: CanvasRenderingContext2D
	x: number
	y: number

	constructor(ctx: CanvasRenderingContext2D, x: number, y: number, options?: T) {
		this.ctx = ctx
		this.x = x
		this.y = y
		this.setOptions(options)
	}

	draw(): void {
		throw new Error('Drawable Method(draw()) not implemented.')
	}

	setOptions = (options?: Partial<T>) => {
		Object.assign(this.options, options)
	}
}

export { Drawable, DrawableOptions }
