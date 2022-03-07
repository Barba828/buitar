import {
  GRADE_NUMS,
  FINGER_GRADE_NUMS,
  DEFAULT_TUNE,
  NOTE_LIST,
  NOTE_FALLING_LIST,
  INTERVAL_LIST,
  INTERVAL_FALLING_LIST,
  chordMap,
  degreeArr,
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
 * 0品调音 转 音高
 * @param zeros 0品调音
 * @returns tuneNumbers 数字音高数组
 */
const getTones = (zeros: ToneType[] = DEFAULT_TUNE) => {
  const zeroGrades = zeros.map(transNote)
  let tuneNums = [NOTE_LIST.indexOf(zeroGrades[0])]
  let upKey = 0

  for (let index = 1; index < zeroGrades.length; index++) {
    const tune = zeroGrades[index]
    const nums = NOTE_LIST.indexOf(tune)

    if (nums + upKey * 12 < tuneNums[index - 1]) {
      upKey++
    }

    tuneNums[index] = nums + upKey * 12
  }

  return tuneNums
}

/**
 * 0品调音 => 指板二维数组
 * @param zeroGrades 指板0品调音
 * @param GradeLength 指板品数
 * @returns Point[][]
 */
const transBoard = (
  zeroTones: ToneType[] = DEFAULT_TUNE,
  GradeLength: number = GRADE_NUMS
) => {
  const zeroGrades = zeroTones.map(transNote)
  const tuneNums = getTones(zeroGrades)

  const boardNums = tuneNums.map((tune, stringIndex) => {
    const stringNums = []
    for (let grade = 0; grade < GradeLength; grade++) {
      const pitch = tune + grade
      const string = stringIndex + 1
      const tone = pitch % NOTE_LIST.length
      const toneType = transTone(tone)
      const index = stringIndex * GradeLength + grade

      const point = {
        tone,
        pitch,
        string,
        grade,
        index,
        ...toneType,
      } as Point

      stringNums[grade] = point
    }
    return stringNums
  })

  return boardNums
}

/**
 * 和弦 => 和弦名称
 * @param chords
 */
const getChordType = (chords: Note[]) => {
  const notes = chords.map((chord) => NOTE_LIST.indexOf(chord))

  let key = 0
  for (let index = 1; index < notes.length; index++) {
    const prev = notes[index - 1]
    const curr = notes[index] > prev ? notes[index] : notes[index] + 12
    const temp = curr - prev
    key = key * 10 + temp
  }

  return {
    note: chords[0],
    ...chordMap.get(key),
  } as ChordType
}

/**
 * 和弦 => 和弦指法
 * @param chords 和弦音数组
 * @param points 指板数组
 * @param fingerSpan 手指品位跨度
 */
const transChordTaps = (
  tones: ToneType[],
  points: Point[][] = transBoard(),
  fingerSpan: number = FINGER_GRADE_NUMS
) => {
  const chords = tones.map(transNote)
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
      if (grade.note === root) {
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
      if (chords.includes(grade.note)) {
        if (
          taps.every((tap) => Math.abs(tap.grade - grade.grade) < fingerSpan)
        ) {
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
      (unique: Point['interval'][], tap) =>
        unique.includes(tap.interval) ? unique : [...unique, tap.interval],
      []
    )
    return intervals.length === chords.length
  }

  /**
   * 排序 根据该和弦品位从低至高
   * @param tapsA
   * @param tapsB
   */
  const gradeSorter = (tapsA: Point[], tapsB: Point[]) => {
    const maxGradeA = Math.max(...tapsA.map((tap) => tap.grade))
    const maxGradeB = Math.max(...tapsB.map((tap) => tap.grade))
    return maxGradeA - maxGradeB
  }

  const chordType = getChordType(chords)
  const chordList = tapsList
    .filter(integrityFilter)
    .filter(fingersFilter)
    .sort(gradeSorter)

  return { chordType, chordList }
}

/**
 * 音字符 => 标准Note字符
 * @param x
 * @returns Note
 */
const transNote = (x: ToneType): Note => {
  return isNote(x)
    ? x
    : isNoteFalling(x)
    ? NOTE_LIST[NOTE_FALLING_LIST.indexOf(x)]
    : isInterval(x)
    ? NOTE_LIST[INTERVAL_LIST.indexOf(x)]
    : NOTE_LIST[INTERVAL_FALLING_LIST.indexOf(x)]
}

/**
 * Note or NoteIndex => Tone所有类型字符
 * @param note
 */
const transTone = (note: Note | number) => {
  let index = 0
  if (typeof note === 'number') {
    index = note
  } else {
    index = NOTE_LIST.findIndex((item) => item === note)
  }
  return {
    note: NOTE_LIST[index],
    noteFalling: NOTE_FALLING_LIST[index],
    interval: INTERVAL_LIST[index],
    intervalFalling: INTERVAL_FALLING_LIST[index],
  }
}

const isNote = (x: any): x is Note => {
  return NOTE_LIST.includes(x)
}
const isNoteFalling = (x: any): x is NoteFalling => {
  return NOTE_FALLING_LIST.includes(x)
}
const isInterval = (x: any): x is Interval => {
  return INTERVAL_LIST.includes(x)
}
const isIntervalFalling = (x: any): x is IntervalFalling => {
  return INTERVAL_FALLING_LIST.includes(x)
}

/**
 * 大调音阶顺阶和弦
 * @param scale 大调
 * @returns 
 */
const transScaleDegree = (scale: ToneType) => {
  const note = transNote(scale)
  const initIndex = NOTE_LIST.findIndex((item) => item === note)
  const intervalLength = NOTE_LIST.length
  const degreeLength = degreeArr.length
  const chordScale = [0, 2, 4] // 顺阶和弦级数增量

  const degrees = degreeArr.map((degree) => {
    const curIndex = (initIndex + degree.interval) % intervalLength
    const toneType = transTone(curIndex)
    return {
      ...toneType,
      tag: degree.tag,
      chord: [] as Note[], // 顺阶和弦
      chordType: {} as ReturnType<typeof getChordType>,
    }
  })
  degrees.forEach((degree, index) => {
    degree.chord = chordScale.map(
      (scale) => degrees[(index + scale) % degreeLength].note
    )
    degree.chordType = getChordType(degree.chord)
  })
  return degrees
}

const transChordDegree = (chords: ToneType[], calGrades: number) => {
let a :number = -3
}

export { 
  // trans指板展示
  transBoard, 
  transChordTaps, 

  transNote, 
  transTone, 

  transScaleDegree,
  transChordDegree
 }
