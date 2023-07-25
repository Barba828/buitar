/**
 * 音符基础配置
 */
import type { Note, NoteFalling, Interval, IntervalFalling, ModeType, DegreeTag, IntervalNum } from '../interface';
/**
 * 音高Interval数组
 */
export declare const NOTE_LIST: Note[];
export declare const NOTE_FALLING_LIST: NoteFalling[];
export declare const INTERVAL_LIST: Interval[];
export declare const INTERVAL_FALLING_LIST: IntervalFalling[];
export declare const DEFAULT_TUNE: Note[];
export declare const DEFAULT_LEVEL = 2;
export declare const NOTE_SORT: Note[];
export declare const MODE_LIST: ModeType[];
export declare const DEGREE_TAG_MAP: Record<IntervalNum, DegreeTag>;
export declare const DEGREE_TAG_LIST: DegreeTag[];
/**
 * 品柱数量，即从 0 ～ 16品
 */
export declare const GRADE_NUMS = 17;
/**
 * 弦数量
 */
export declare const STRING_NUMS = 6;
/**
 * 手指品柱跨度
 */
export declare const FINGER_GRADE_NUMS = 4;
