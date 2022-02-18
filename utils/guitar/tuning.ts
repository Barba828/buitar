import {
  GRADE_NUMS,
  INTERVAL_LIST,
  DEFAULT_TUNE,
  INTERVAL_FALLING_LIST,
  Note_LIST,
  Note_FALLING_LIST,
  chordMap
} from './config.js'

/**
 * 便于计算，默认调音一线零品为低音，即
 * 数字 0~11 => 低音 C~B
 * 数字 12~23 => 标音 C~B
 * 数字 24~35 => 高音 C~B
 *
 * 标准调弦吉他：['E', 'A', 'D', 'G', 'B', 'E']
 * 即绝对音高为：[4, 9, 14, 19, 23, 28]
 */

/**
 * 0品调音 转 数字音高
 * @param zeroGrades 0品调音
 * @returns tuneNumbers 数字音高数组
 */
const intervalToNums = (zeroGrades: Interval[] = DEFAULT_TUNE) => {
  let tuneNums = [INTERVAL_LIST.indexOf(zeroGrades[0])]
  let upKey = 0

  for (let index = 1; index < zeroGrades.length; index++) {
    const tune = zeroGrades[index]
    const nums = INTERVAL_LIST.indexOf(tune)

    if (nums + upKey * 12 < tuneNums[index - 1]) {
      upKey++
    }

    tuneNums[index] = nums + upKey * 12
  }

  return tuneNums
}

/**
 * 0品调音 转 指板数据
 * @param zeroGrades 指板0品调音
 * @param GradeLength 指板品数
 * @returns Point[][]
 */
const transBoard = (zeroGrades: Interval[] = DEFAULT_TUNE, GradeLength: number = GRADE_NUMS) => {
  const tuneNums = intervalToNums(zeroGrades)

  const boardNums = tuneNums.map((tune, index) => {
    const stringNums = []
    for (let grade = 0; grade < GradeLength; grade++) {
      const pitch = tune + grade
      const string = index + 1
      const tone = pitch % 12
      const interval = INTERVAL_LIST[tone]
      const intervalFalling = INTERVAL_FALLING_LIST[tone]
      const note = Note_LIST[tone]
      const noteFalling = Note_FALLING_LIST[tone]

      const point = {
        // tone,
        // pitch,
        interval,
        // intervalFalling,
        // note,
        // noteFalling,
        string,
        grade,
      } as Point

      stringNums[grade] = point
    }
    return stringNums
  })

  return boardNums
}

const board = transBoard()

/**
 * 和弦 => 和弦名称
 * @param chords 
 */
const getChordName = (chords: Interval[]) => {
  const notes = chords.map((chord) => INTERVAL_LIST.indexOf(chord))
  
  let key = 0
  for (let index = 1; index < notes.length; index++) {
    const prev = notes[index - 1]
    const temp = notes[index] - prev
    key = prev * 10 + temp
  }
  
  return `${chords[0]}${chordMap.get(key)}`
}

/**
 * 和弦 => 和弦指法
 * @param chords 
 * @param points 指板数组
 */
const transChord = (chords: Interval[], points: Point[][] = board) => {
  const root = chords[0] //当前根音
  const roots: Point[] = [] // 指板上的所有根音 数组
  const tapsList: Point[][] = [] // 指板上所有的符合的和弦 数组

  // 检索根音位置
  points.forEach((grades, stringIndex) => {
    // 有几根弦 > 和弦音数
    if (stringIndex > points.length - chords.length) {
      return
    }
    grades.forEach((grade) => {
      if (grade.interval === root) {
        roots.push(grade)
      }
    })
  })

  /**
   * 递归获取当前弦之后所有符合和弦音的和弦列表
   * @param stringIndex 当前弦下标
   * @param taps 递归当前和弦列表
   */
  const findNextString = (stringIndex: number, taps: Point[]) => {
    if (stringIndex >= points.length) {
      tapsList.push(taps)
      return
    }

    const grades = points[stringIndex]
    grades.forEach((grade) => {
      if (chords.includes(grade.interval)) {
        if (taps.every((tap) => Math.abs(tap.grade - grade.grade) < 5)) {
          findNextString(stringIndex + 1, [...taps, grade])
        }
      }
    })
  }

  // 获取所有根音下的和弦列表
  roots.forEach((point) => {
    findNextString(point.string, [point])
  })

  /**
   * 过滤 和弦指法手指按位超过4（正常指法不超过4根手指）
   * @param taps
   * @returns
   */
  const fingersFilter = (taps: Point[]) => {
    // 最小品位（最小品位超过1，则为横按指法）
    const minGrade = Math.min(...taps.map((tap) => tap.grade))
    let fingerNums = minGrade > 0 ? 1 : 0
    taps.forEach((tap) => {
      if (tap.grade > minGrade) {
        fingerNums++
      }
    })
    return fingerNums <= 4
  }

  /**
   * 过滤 非完整和弦音组成
   * @param taps
   */
  const integrityFilter = (taps: Point[]) => {
    const intervals = taps.reduce(
      (unique: Point['interval'][], tap) => (unique.includes(tap.interval) ? unique : [...unique, tap.interval]),
      []
    )
    return intervals.length === chords.length
  }

  console.log(getChordName(chords))
  
  return tapsList.filter(integrityFilter).filter(fingersFilter)
}

export { transBoard, transChord }
