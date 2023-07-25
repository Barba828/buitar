/**
 * 和弦配置
 */
import type { ChordDegreeNum, ChordType, DegreeType, ModeType } from '../interface';
/**
 * 和弦乐理配置
 */
/**
 * 和弦分类
 */
declare const chordMap: Map<number, ChordType>;
/**
 * 和弦级数分类
 */
declare const degreeMap: Map<ModeType, DegreeType[]>;
/**
 * 顺接和弦级数
 * 三和弦/七和弦/九和弦
 */
declare const chordDegreeMap: Map<ChordDegreeNum, {
    name: string;
    interval: number[];
}>;
export { chordMap, degreeMap, chordDegreeMap };
