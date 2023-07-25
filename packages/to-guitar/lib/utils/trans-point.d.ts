import type { Tone, Point, GuitarBoard, ModeType } from '../interface';
/**
 * 0品调音 => 指板二维数组
 * @param zeroGrades 指板0品调音
 * @param GradeLength 指板品数
 * @param baseLevel 基准音高
 * @returns Point[][]
 */
declare const transBoard: (zeroTones?: Tone[], GradeLength?: number, baseLevel?: number) => GuitarBoard;
/**
 * 和弦音名数组 + 指板 => 和弦指法
 * @param chords 和弦音数组
 * @param board 指板数组
 * @param fingerSpan 手指品位跨度
 */
declare const transChordTaps: (tones: Tone[], board?: GuitarBoard, fingerSpan?: number) => {
    chordType: import("../interface").ChordType[];
    chordList: Point[][];
};
/**
 * 获取调式音阶基础指法(上行 & 下行)
 * @param root 根音
 * @param board 指板
 * @param mode 调式
 */
declare const getModeFregTaps: (root: Point, board?: GuitarBoard, mode?: ModeType) => {
    up: Point[];
    down: Point[];
};
/**
 * 获取指板某范围内某调式音阶
 * @param root
 * @param board
 * @param mode
 * @param range
 * @returns
 */
declare const getModeRangeTaps: (root: Point | Tone, board?: GuitarBoard, mode?: ModeType, range?: [number, number]) => Point[];
export { transBoard, // 二维指板数组
transChordTaps, // 和弦指板位置
getModeFregTaps, // 获取调式音阶基础指法(上行 & 下行)
getModeRangeTaps, };
