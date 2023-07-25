import type { Chord, ChordDegreeNum, ModeType, Point, Tone } from '../interface';
type BoardOption = {
    /**
     * 调式「自然大调」
     */
    mode: ModeType;
    /**
     * 音阶「 C 」
     */
    scale: Tone;
    /**
     * 和弦类型「三和弦」
     */
    chordNumType: ChordDegreeNum;
    /**
     * 调内顺阶和弦「 C Dm Em ... 」
     */
    chords: Chord[];
    /**
     * 指板
     * 「弦数」 * 「品数」
     */
    keyboard: Point[][];
    /**
     * 调音「 EADGBE 」
     * 数组长度也表示了指板「弦数」
     */
    baseTone: Tone[];
    /**
     * 指板「品数」
     */
    baseFret: number;
    /**
     * 最低音 level 「 2 」
     * 根音「 E 」默认为 E2 音
     */
    baseLevel: number;
};
type BoardOptionProps = Pick<BoardOption, 'mode' | 'scale' | 'chordNumType' | 'baseTone' | 'baseFret' | 'baseLevel'>;
declare const defaultOptions: BoardOptionProps;
declare class Board {
    private emit;
    private readonly _board;
    /**
     * 指板图
     * @param emit 指板数据修改回调函数
     * @param options 配置
     */
    constructor(emit: (board: BoardOption) => void, options?: Partial<BoardOptionProps>);
    get board(): BoardOption;
    /**
     * 设置Board属性，自动emit
     * @param options
     */
    setOptions: (options: Partial<BoardOptionProps>) => void;
    private getKeyBoard;
    private getChords;
    /**
     * 自定义 Keyboard point
     * @param points
     */
    setKeyboardStatus: (points: Point[]) => void;
    resetKeyboardStatus: () => void;
}
export { Board, BoardOption, BoardOptionProps, defaultOptions as defaultBoardOptions };
