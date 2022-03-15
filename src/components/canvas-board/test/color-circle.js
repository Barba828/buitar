
const cn = document.getElementById('canvas')
const ctx = cn.getContext('2d')
const points = []
const position = {
  x: innerWidth / 2,
  y: innerHeight / 2,
}

window.onmousemove = function (e) {
  position.x = e.clientX
  position.y = e.clientY
}

function getRandomColor() {
  var s = '0123456789ABCDEF'
  var ctx = '#'
  for (var i = 0; i < 6; i++) {
    ctx += s[Math.ceil(Math.random() * 15)]
  }
  return ctx
}

window.onload = function myfunction() {
  ctx.lineWidth = '2'
  ctx.globalAlpha = 0.5
  resize()
  anim()
}

window.onresize = function () {
  resize()
}

function resize() {
  cn.height = innerHeight
  cn.width = innerWidth
  for (var i = 0; i < 101; i++) {
    points[i] = new PointUI(innerWidth / 2, innerHeight / 2, 4, getRandomColor(), Math.random() * 150, 0.02)
  }
}

class PointUI {
  constructor(x, y, r, cc, t, s) {
    this.x = x
    this.y = y
    this.r = r // lineWidth
    this.cc = cc // lineColor
    this.t = t // 旋转半径
    this.s = s // 自动动画旋转角速度

    this.theta = Math.random() * Math.PI * 2 //角变量
  }

  dr = function () {
    const ls = {
      x: this.x,
      y: this.y,
    } // 上一状态位置
    this.theta += this.s // 当前角变量
    this.x = position.x + Math.cos(this.theta) * this.t //当前位置x
    this.y = position.y + Math.sin(this.theta) * this.t //当前位置y
    ctx.beginPath()
    ctx.lineWidth = this.r
    ctx.strokeStyle = this.cc
    ctx.moveTo(ls.x, ls.y)
    ctx.lineTo(this.x, this.y)
    ctx.stroke()
    ctx.closePath()
  }
}

function anim() {
  // ctx.clearRect() // clear会每次渲染旋转的点
  ctx.fillStyle = 'rgba(0,0,0,0.05)'
  ctx.fillRect(0, 0, cn.width, cn.height) // 
  points.forEach((point) => point.dr())
  requestAnimationFrame(anim) // 递归自动帧动画
}
