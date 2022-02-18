// 检测数据类型的公用方法
function is(data) {
  return function (type) {
    return Object.prototype.toString.call(data) === `[object ${type}]`
  }
}

/**
 * 唱名
 */
const syllableMap = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si']
/**
 * 调名
 */
const intervalMap = [
  'C',
  ['#C', 'bD'],
  'D',
  ['#D', 'bE'],
  'E',
  'F',
  ['#F', 'bG'],
  'G',
  ['#G', 'bA'],
  'A',
  ['#A', 'bB'],
  'B',
]
/**
 * 音程
 */
const keyMap = [
  '1',
  ['#1', 'b2'],
  '2',
  ['#2', 'b3'],
  '3',
  '4',
  ['#4', 'b5'],
  '5',
  ['#5', 'b6'],
  '6',
  ['#6', 'b7'],
  '7',
]

// 单音类，用于音的映射查询与音高的改变，同时可标记记录其在吉他上的位置
class Tone {
  constructor(toneString = '1', string, fret) {
    // 所有唱名数组
    this.syllableMap = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si']
    // 音程
    this.keyMap = [
      '1',
      ['#1', 'b2'],
      '2',
      ['#2', 'b3'],
      '3',
      '4',
      ['#4', 'b5'],
      '5',
      ['#5', 'b6'],
      '6',
      ['#6', 'b7'],
      '7',
    ]
    //所有调名
    this.intervalMap = [
      'C',
      ['#C', 'bD'],
      'D',
      ['#D', 'bE'],
      'E',
      'F',
      ['#F', 'bG'],
      'G',
      ['#G', 'bA'],
      'A',
      ['#A', 'bB'],
      'B',
    ]
    // 单音的字符串表示
    this.toneString = toneString
    // 单音的字符串表示（去除八度标记）
    this.toneNormal = toneString.replace(/\./g, '')
    // 数字音
    this.key = toneString.replace(/\.|b|#/g, '')
    // 唱名
    this.syllableName = this.syllableMap[+this.key - 1]
    // 降半调标记
    this.flat = toneString.match('b') ? 'b' : ''
    // 升半调标记
    this.sharp = toneString.match('#') ? '#' : ''
    let octave_arr = toneString.split(this.key)
    let octave_flat = octave_arr[0].toString().match(/\./g)
    let octave_sharp = octave_arr[1].toString().match(/\./g)
    // 八度度数
    this.octave =
      (octave_sharp ? octave_sharp.length : 0) -
      (octave_flat ? octave_flat.length : 0)
    // 吉他按弦位置
    this.position = {
      // 第几弦
      string: string,
      // 第几品格
      fret: fret,
    }
  }
  // 获取某个音在音程上的位置
  findKeyIndex(keyString) {
    return this.keyMap.findIndex((item) => {
      if (is(item)('Array')) {
        return item.includes(keyString)
      } else if (item === keyString) {
        return true
      } else {
        return false
      }
    })
  }
  // 音高增减，num为增或减的半音数量
  step(num) {
    let keyString = this.flat + this.sharp + this.key
    let len = this.keyMap.length
    let index = this.findKeyIndex(keyString)
    if (index > -1) {
      num = +num
      // 计算改变音高后的音在音程上的位置
      let nextIndex = parseInt(index + num, 0)
      let octave = this.octave
      if (nextIndex >= len) {
        let index_gap = nextIndex - len
        octave += Math.floor(index_gap / len) + 1
        nextIndex = index_gap % len
      } else if (nextIndex < 0) {
        let index_gap = nextIndex
        octave += Math.floor(index_gap / len)
        nextIndex = (index_gap % len) + len
      }
      let nextKey = this.keyMap[nextIndex]
      // 计算并添加高低八度的记号
      let octaveString = new Array(Math.abs(octave)).fill('.').join('')
      let toneString = ''
      if (!is(nextKey)('Array')) {
        toneString =
          (octave < 0 ? octaveString : '') +
          nextKey +
          (octave > 0 ? octaveString : '')
        return new this.constructor(
          toneString,
          this.position.string,
          this.position.fret + num
        )
      } else {
        // 可能得到两个音高一样但标记方式不一样的音
        return nextKey.map((key) => {
          return new this.constructor(
            (octave < 0 ? octaveString : '') +
              key +
              (octave > 0 ? octaveString : ''),
            this.position.string,
            this.position.fret + num
          )
        })
      }
    } else {
      return null
    }
  }
}
