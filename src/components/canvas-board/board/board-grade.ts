import {
  Color,
  GRADE_LINE_WIDTH,
  SINGLE_HEIGHT,
  SINGLE_WIDTH,
} from './config.js'
import { Drawable, DrawableOptions } from './drawable.js'

type BoardGradeDrawableOptions = {
  lineColor: string
  lineLength: number
}

const defaultOptions = {
  lineColor: Color.Grade.Default,
  lineLength: SINGLE_WIDTH * (6 - 1),
}

export class BoardGrade
  extends Drawable<BoardGradeDrawableOptions>
  implements DrawableOptions
{
  title?: number | string = ''

  drawable = {
    line: new Path2D(),
  }

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    title?: number | string,
    options?: Partial<BoardGradeDrawableOptions>
  ) {
    super(ctx, x, y, { ...defaultOptions, ...options })
    this.title = title
    this.initDrawable()
  }

  initDrawable = () => {
    const { line } = this.drawable
    const { lineLength } = this.options

    line.moveTo(this.x, this.y)
    line.lineTo(this.x + lineLength, this.y)
  }

  draw = () => {
    this.ctx.save()
    this.ctx.beginPath()

    this.ctx.lineCap = 'round'
    this.ctx.strokeStyle = this.options.lineColor
    this.ctx.lineWidth = GRADE_LINE_WIDTH

    this.ctx.stroke(this.drawable.line)

    this.ctx.fillStyle = this.options.lineColor
    this.ctx.font = `${SINGLE_WIDTH / 2}px not specified`
    this.ctx.fillText(
      `${this.title}`,
      this.x - SINGLE_WIDTH * 0.8,
      this.y + SINGLE_HEIGHT / 2
    )

    this.ctx.restore()
  }
}
