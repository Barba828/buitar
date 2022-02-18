import {
  Color,
  GRADE_LINE_WIDTH,
  SINGLE_HEIGHT,
  SINGLE_WIDTH,
} from './config.js'
import { Drawable, DrawableOptions } from './drawable.js'

interface BoardButtonOptions extends DrawableOptions {
  /**
   * 音
   */
  point: Point
}

type BoardButtonDrawableOptions = {
  buttonColor: string
  buttonCheckedColor: string
  buttonFocusColor: string
  textColor: string
  lineColor: string
  lineLength: number
  r: number
  checked: boolean
  focus: boolean
  pointType: PointType
  pointDisable?: boolean
  onlyButton?: boolean
}

export class BoardButton
  extends Drawable<BoardButtonDrawableOptions>
  implements BoardButtonOptions
{
  point: Point

  drawable = {
    line: new Path2D(),
    button: new Path2D(),
  }

  defaultOptions = {
    buttonColor: Color.Button.Default,
    buttonCheckedColor: Color.Button.Checked,
    buttonFocusColor: Color.Button.Focus,
    textColor: Color.Text.Default,
    lineColor: Color.String.Default,
    lineLength: SINGLE_HEIGHT,
    r: (SINGLE_WIDTH / 2) * 0.8,
    checked: false,
    focus: false,
    pointType: 'interval',
  } as BoardButtonDrawableOptions

  constructor(
    ctx: CanvasRenderingContext2D,
    x = 0,
    y = 0,
    point: Point,
    options?: Partial<BoardButtonDrawableOptions>
  ) {
    super(ctx, x, y)
    this.point = point
    this.defaultOptions = { ...this.defaultOptions, ...options }
    this.initDrawable()
  }

  initDrawable = () => {
    this.setOptions({ ...this.defaultOptions })

    const { line, button } = this.drawable
    const { r, lineLength, onlyButton } = this.options

    if (onlyButton) {
      // button.arc(this.x, this.y, r, 0, Math.PI * 2, false)
      return
    }
    line.moveTo(this.x, this.y - lineLength / 2 + GRADE_LINE_WIDTH / 2)
    line.lineTo(this.x, this.y + lineLength / 2 - GRADE_LINE_WIDTH / 2)

    button.arc(this.x, this.y, r, 0, Math.PI * 2, false)
  }

  /**
   * 绘制
   */
  draw = () => {
    const {
      r,
      buttonColor,
      buttonFocusColor,
      buttonCheckedColor,
      lineColor,
      textColor,
      focus,
      checked,
      onlyButton,
      pointDisable,
      pointType,
    } = this.options
    this.clear()
    // 品线
    this.ctx.strokeStyle = lineColor
    this.ctx.stroke(this.drawable.line)
    
    if(pointDisable){
      return
    }
    // 按钮
    this.ctx.fillStyle = checked
      ? buttonCheckedColor
      : focus
      ? buttonFocusColor
      : buttonColor
    this.ctx.fill(this.drawable.button)

    // 和弦字符
    this.ctx.fillStyle = onlyButton ? lineColor : textColor
    this.ctx.font = `${r}px not specified`
    this.ctx.fillText(this.point[pointType], this.x, this.y)
  }

  clear = () => {
    const { lineLength } = this.options
    this.ctx.clearRect(
      this.x - SINGLE_WIDTH / 2,
      this.y - lineLength / 2 + GRADE_LINE_WIDTH / 2,
      SINGLE_WIDTH,
      lineLength - GRADE_LINE_WIDTH
    )
  }

  redraw = () => {
    this.setOptions(this.defaultOptions)
  }

  onFocus = () => {
    this.setOptions({
      focus: true,
    })
  }

  onBlur = () => {
    this.setOptions({
      focus: false,
    })
  }

  onChecked = () => {
    this.setOptions({
      checked: true,
    })
  }

  onUnChecked = () => {
    this.setOptions({
      checked: false,
    })
  }

  isOver = (x: number, y: number) => {
    return this.ctx.isPointInPath(this.drawable.button, x, y)
    // const distance = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2))
    // return this.options.r > distance
  }
}
