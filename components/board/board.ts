import { transBoard, transChord } from '../../utils/guitar/tuning.js'
import { BoardButton } from './board-button.js'
import { BoardGrade } from './board-grade.js'
import { PADDING, SINGLE_HEIGHT, SINGLE_WIDTH } from './config.js'
import { Drawable, DrawableOptions } from './drawable.js'

interface BoardOptions extends DrawableOptions {
  boardButtons: BoardButton[]
  boardGrades: BoardGrade[]
}

export class Board extends Drawable<any> implements BoardOptions {
  options = { gradeLineColor: 'gray' }
  boardButtons: BoardButton[] = []
  boardGrades: BoardGrade[] = []

  verty: number = PADDING // 垂直边距
  horiz: number = PADDING * 1.5 // 水平边距
  canvas: HTMLCanvasElement
  boardArr: string[][] = [] // 指板二维数组[弦][品]
  focusButton?: BoardButton | null
  checkedButtons: BoardButton[] = []

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    super(ctx, 0, 0)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    this.canvas = canvas
    this.initDrawable()
  }

  initDrawable = () => {
    const strings = transBoard()
    const grades = strings[0]
    // 品丝 & 数字
    grades.forEach((_grade, index) => {
      const x = this.horiz
      const y = this.verty + index * SINGLE_HEIGHT
      const title = index + 1 === grades.length ? '' : index + 1

      const boardGrade = new BoardGrade(this.ctx, x, y, title)
      this.boardGrades.push(boardGrade)
    })

    // 指板图
    strings.forEach((string, xIndex) => {
      string.forEach((point, yIndex) => {
        let x = this.horiz + xIndex * SINGLE_WIDTH
        let button

        if (yIndex === 0) {
          // 0 品渲染调音按钮
          const y = this.verty + (yIndex - 0.4) * SINGLE_HEIGHT
          button = new BoardButton(this.ctx, x, y, point, {
            onlyButton: true,
            lineLength: SINGLE_WIDTH,
          })
        } else {
          // 显示该品音
          const y = this.verty + (yIndex - 0.5) * SINGLE_HEIGHT
          button = new BoardButton(this.ctx, x, y, point, {
            pointDisable: point.interval.includes('#'),
          })
        }
        this.boardButtons.push(button)
      })
    })
  }

  addButtonListener = (
    type: 'mousemove' | 'click' | 'change',
    listener: (button: BoardButton) => void
  ) => {
    if (type === 'mousemove') {
      this.canvas.addEventListener('mousemove', (e) => {
        const button = this.getTargetButton(e.offsetX, e.offsetY)
        if (!button) {
          if (this.focusButton) {
            this.focusButton.onBlur()
          }

          this.focusButton = null
          return
        }
        listener(button)
        if (this.focusButton === button) {
          return
        }
        this.focusButton && this.focusButton.onBlur()
        this.focusButton = button
        this.focusButton.onFocus()
      })
    } else if (type === 'click' || type === 'change') {
      this.canvas.addEventListener('click', (e) => {
        const button = this.boardButtons.find((button) =>
          button.isOver(e.offsetX, e.offsetY)
        )
        if (!button) {
          return
        }

        const btnIndex = this.checkedButtons.indexOf(button)

        if (btnIndex >= 0) {
          this.checkedButtons.splice(btnIndex, 1)
          button.redraw()
          return
        } else {
          this.checkedButtons.push(button)
          button.onChecked()
        }
        listener(button)
      })
    }
  }

  getTargetButton = (x: number, y: number) => {
    const button = this.boardButtons.find((button) => button.isOver(x, y))
    return button
  }

  draw = () => {
    this.boardButtons.forEach((button) => button.draw())
    this.boardGrades.forEach((grade) => grade.draw())
  }

  drawSetOptions = (allButton: boolean) => {
    this.boardButtons.forEach((button) => {
      if (!allButton) {
        button.setOptions({ pointDisable: button.point.interval.includes('#') })
      } else {
        button.setOptions({ pointDisable: false })
      }
    })
  }
}

console.log(transChord(['C', 'E', 'G']))
