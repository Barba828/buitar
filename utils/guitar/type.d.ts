declare type Interval =
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
declare type IntervalFalling =
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
declare type Note =
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
declare type NoteFalling =
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
   * 音名
   * Interval #
   */
  interval: Interval
  /**
   * 音名
   * interval b
   */
  intervalFalling: IntervalFalling
  /**
   * 音名
   * Note #
   */
  note: Note
  /**
   * 音民
   * Note b
   */
  noteFalling: NoteFalling
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
}

/**
 * Point标题类型
 */
declare type PointType = 'interval' | 'intervalFalling' | 'note' | 'noteFalling'

declare type Chord = {}
