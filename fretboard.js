import { name } from './test.js'

const INTERVAL_LIST = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

let rate = 2

const SINGLE_HEIGHT = 60 * rate
const SINGLE_WIDTH = 20 * rate
const PADDING = SINGLE_WIDTH
const GRADE_NUMS = 22
const STRING_NUMS = 6

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = SINGLE_WIDTH * (STRING_NUMS - 1) + PADDING * 2
canvas.height = SINGLE_HEIGHT * (GRADE_NUMS - 1) + PADDING * 2

const buttonList = []

/**
 * 转换指板二维数组
 * @param {*} stringGrade 0品调音
 * @returns
 */
const setBoardArr = (stringGrade = ['E', 'A', 'D', 'G', 'B', 'E']) => {
  const stringIndex = stringGrade.map((item) => INTERVAL_LIST.indexOf(item))
  const ans = stringGrade.map((item) => [item])
  for (let stringNums = 0; stringNums < STRING_NUMS; stringNums++) {
    for (let grade = 1; grade < GRADE_NUMS; grade++) {
      ans[stringNums][grade] = INTERVAL_LIST[(stringIndex[stringNums] + grade) % INTERVAL_LIST.length]
    }
  }
  return ans
}

/**
 * 指板
 */
const drawBoard = (boardArr = setBoardArr(), lineColor = 'gray', gradeColor = '#123456') => {
  const verty = PADDING // 垂直边距
  const horiz = PADDING // 水平边距

  // 22品线
  for (let gradeNums = 0; gradeNums < GRADE_NUMS; gradeNums++) {
    ctx.beginPath()
    ctx.strokeStyle = lineColor

    const x = horiz
    const y = verty + gradeNums * SINGLE_HEIGHT
    ctx.moveTo(x, y)
    ctx.lineTo(x + SINGLE_WIDTH * (STRING_NUMS - 1), y)

    ctx.stroke()

    // 每品6弦
    for (let stringNums = 0; stringNums < STRING_NUMS; stringNums++) {
      const gradeText = boardArr[stringNums][gradeNums + 1] // +1是因为 0品 并不在品线上
      if (gradeText) {
        const xString = stringNums * SINGLE_WIDTH + horiz
        const button = new BoardButton(gradeText, xString, y + SINGLE_HEIGHT / 2)
        button.draw()
        button.drawLine()
        buttonList.push(button)
      }
    }
  }

  // 0品 调音
  for (let stringNums = 0; stringNums < STRING_NUMS; stringNums++) {
    const yString = verty * 0.5
    const xString = horiz + stringNums * SINGLE_WIDTH

    ctx.fillStyle = lineColor
    ctx.font = `${SINGLE_WIDTH * 0.5}px not specified`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(boardArr[stringNums][0] || '', xString, yString)
  }

  // 品位 数字
  for (let gradeNums = 1; gradeNums < GRADE_NUMS; gradeNums++) {
    const yString = verty + (gradeNums - 0.5) * SINGLE_HEIGHT
    const xString = horiz * 0.3

    ctx.fillStyle = lineColor
    ctx.font = `${SINGLE_WIDTH * 0.5}px not specified`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(gradeNums, xString, yString)
  }
}

canvas.addEventListener('mousemove', (e) => {
  const button = buttonList.find((button) => button.isInButton(e.offsetX, e.offsetY))

  if (button && button.options.buttonColor !== 'blue') {
    button.setOptions({
      buttonColor: 'blue',
    })
    button.draw()
  }
})

class BoardButton {
  options = {
    buttonColor: 'gray',
    textColor: 'white',
  }

  constructor(interval, x = 0, y = 0, r = (SINGLE_WIDTH / 2) * 0.8) {
    this.interval = interval
    this.x = x
    this.y = y
    this.r = r
  }

  drawLine = (lineLength = SINGLE_HEIGHT) => {
    // 品线
    ctx.beginPath()
    ctx.moveTo(this.x, this.y - lineLength / 2)
    ctx.lineTo(this.x, this.y + lineLength / 2)
    ctx.stroke()
  }

  draw = () => {
    ctx.save()
    // 和弦按钮
    ctx.beginPath()
    ctx.fillStyle = this.options.buttonColor
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
    ctx.fill()

    // 和弦符号
    ctx.beginPath()
    ctx.fillStyle = this.options.textColor
    ctx.font = `${this.r}px not specified`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.interval, this.x, this.y)

    ctx.translate(0, 28.5)

    ctx.restore()
  }

  setOptions = (options) => {
    this.options = { ...this.options, ...options }
  }

  isInButton = (x, y) => {
    const distance = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2))
    return this.r > distance
  }
}

drawBoard()
