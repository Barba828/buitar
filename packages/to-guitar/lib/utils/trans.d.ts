import type { Note, Tone, ChordType, ChordDegreeNum, ModeType, Chord } from '../interface';
/**
 * 数字级数 => 罗马级数
 * @param degree
 * @returns
 */
declare const getDegreeTag: (degree: string | number) => import("../interface").DegreeTag | "";
/**
 * 和弦根音 => 和弦
 * @param tone 根音
 * @param chordTypeTag 和弦类型标记（'m'|'aug'|'dim'|...）
 * @returns
 */
declare const transChord: (tone: Tone, chordTypeTag?: string) => {
    chord: Note[];
    chordType: ChordType;
} | null;
/**
 * 调式 & 调 => 顺阶音调
 * @param {
 *  @attr mode 调式 默认「major自然大调」
 *  @attr scale 大调音阶 默认「C调」
 * }
 * @returns 大调音阶顺阶音调 数组
 */
declare const transScale: ({ mode, scale }: {
    mode?: ModeType | undefined;
    scale?: Tone | undefined;
}) => Chord[];
/**
 * 调式 & 调 => 顺阶和弦
 * @param {
 *  @attr mode 调式 默认「major自然大调」
 *  @attr scale 大调音阶 默认「C调」
 *  @attr chordNumType 和弦类型 默认「3和弦」
 * }
 * @returns 大调音阶顺阶和弦 数组
 */
declare const transScaleDegree: ({ mode, scale, chordNumType, }: {
    mode?: ModeType | undefined;
    scale?: Tone | undefined;
    chordNumType?: ChordDegreeNum | undefined;
}) => Chord[];
/**
 * 和弦 => 和弦名称 & 类型
 * @param chords 和弦音数组
 * @param calGrades 升降度数 默认不变调
 */
declare const transChordType: (chords: Tone[], calGrades?: number) => ChordType[];
/**
 * 五度圈 数组
 * @param root 根音 默认「C」
 */
declare const transFifthsCircle: (root?: Tone) => import("../interface").ToneSchema[];
export { getDegreeTag, transChord, transChordType, transScale, transScaleDegree, transFifthsCircle };
