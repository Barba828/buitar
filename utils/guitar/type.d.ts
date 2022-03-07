declare type Note =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B'
declare type NoteFalling =
  | 'C'
  | 'bD'
  | 'D'
  | 'bE'
  | 'E'
  | 'F'
  | 'bG'
  | 'G'
  | 'bA'
  | 'A'
  | 'bB'
  | 'B'
declare type Interval =
  | '1'
  | '1#'
  | '2'
  | '2#'
  | '3'
  | '4'
  | '4#'
  | '5'
  | '5#'
  | '6'
  | '6#'
  | '7'
declare type IntervalFalling =
  | '1'
  | 'b2'
  | '2'
  | 'b3'
  | '3'
  | '4'
  | 'b5'
  | '5'
  | 'b6'
  | '6'
  | 'b7'
  | '7'
declare type ToneType = Note | NoteFalling | Interval | IntervalFalling
declare type Pitch = number

declare type Point = {
  /**
   * 相对音高
   * Tone: relative 0～11
   */
  tone: Pitch
  /**
   * 绝对音高
   * Pitch: absolute 0～∞
   */
  pitch: Pitch
  /**
   * 音名 升调
   * Note #
   */
  note: Note
  /**
   * 音名 降调
   * interval b
   */
  noteFalling: NoteFalling
  /**
   * 音程 升调
   * Interval #
   */
  interval: Interval
  /**
   * 音程 降调
   * Interval b
   */
  intervalFalling: IntervalFalling
  /**
   * 弦位
   * string position
   */
  string: number
  /**
   * 品位
   * grade position
   */
  grade: number
  /**
   * 唯一下标
   */
  index: number
}

/**
 * Point标题类型
 */
declare type PointType = 'note' | 'noteFalling' | 'interval' | 'intervalFalling'

declare type ChordType = {
  /**
   * 和弦标记
   * dim|aug|...
   */
  tag: string
  /**
   * 和弦名称
   * major triad|...
   */
  name: string
  /**
   * 和弦音名
   * C|D|...
   */
  note?: Note
}

declare type DegreeTag = 'Ⅰ' | 'Ⅱ' | 'Ⅲ' | 'Ⅳ' | 'Ⅴ' | 'Ⅵ' | 'Ⅶ'
declare type RollType = 'Do' | 'Re' | 'Mi' | 'Fa' | 'So' | 'La' | 'Ti'
declare type DegreeType = {
  /**
   * 音程
   * 距离I级和弦音程
   */
  interval: number
  /**
   * 级数
   * 罗马数字标记
   */
  tag: DegreeTag
  /**
   * 级数类型
   */
  scale: string
  /**
   * 唱名
   */
  roll: RollType
}
