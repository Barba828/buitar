declare type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
declare type NoteFalling = 'C' | 'Db' | 'D' | 'Eb' | 'E' | 'F' | 'Gb' | 'G' | 'Ab' | 'A' | 'Bb' | 'B';
declare type Interval = '1' | '1#' | '2' | '2#' | '3' | '4' | '4#' | '5' | '5#' | '6' | '6#' | '7';
declare type IntervalFalling = '1' | '2b' | '2' | '3b' | '3' | '4' | '5b' | '5' | '6b' | '6' | '7b' | '7';
declare type IntervalExtended = '8' | '8#' | '9b' | '9' | '9#' | '10b' | '10' | '11' | '11#' | '12b' | '12' | '12#' | '13b' | '13' | '13#' | '14b' | '14';
declare type IntervalAll = Interval | IntervalFalling | IntervalExtended;
declare type IntervalNum = 1 | 2 | 3 | 4 | 5 | 6 | 7;
/**
 * 音符类型
 */
declare type Tone = Note | NoteFalling | Interval | IntervalFalling | IntervalNum;
/**
 * ToneType名称
 */
declare type ToneTypeName = 'note' | 'noteFalling' | 'interval' | 'intervalFalling';
declare type ToneSchema = {
    /**
     * 音名 升调
     * Note #
     */
    note: Note;
    /**
     * 音名 降调
     * Note b
     */
    noteFalling: NoteFalling;
    /**
     * 音程 升调
     * Interval #
     */
    interval: Interval;
    /**
     * 音程 降调
     * Interval b
     */
    intervalFalling: IntervalFalling;
    /**
     * 下标
     */
    index?: number;
    /**
     * 八度高度
     * C4
     */
    level?: number;
};
declare type Pitch = number;
/**
 * 指板音符位置
 */
declare type Point = {
    /**
     * 相对音高
     * Tone: relative 0～11
     */
    tone: Pitch;
    /**
     * 绝对音高
     * Pitch: absolute 0～∞
     */
    pitch: Pitch;
    /**
     * 音高
     */
    toneSchema: ToneSchema;
    /**
     * 弦位
     * string position
     */
    string: number;
    /**
     * 品位
     * grade position
     */
    grade: number;
    /**
     * 唯一下标
     */
    index: number;
    /**
     * 扩展属性
     */
    [key: string]: any;
};

declare type ChordType = {
    /**
     * 和弦标记
     * dim|aug|...
     */
    tag: string;
    /**
     * 和弦名称
     * major triad|...
     */
    name: string;
    /**
     * 中文和弦名称
     */
    name_zh: string;
    /**
     * 和弦组成音
     */
    constitute?: IntervalAll[];
    /**
     * 和弦根音名
     * C|D|...
     */
    tone?: ToneSchema;
    /**
     * 转位和弦 即实际和弦名称over/note
     * C/E ("C over E")
     */
    over?: ToneSchema;
};
/**
 * 和弦级数
 */
declare type DegreeTag = 'Ⅰ' | 'Ⅱ' | 'Ⅲ' | 'Ⅳ' | 'Ⅴ' | 'Ⅵ' | 'Ⅶ';
declare type RollType = 'Do' | 'Di' | 'Ra' | 'Re' | 'Mi' | 'Fa' | 'Fi' | 'Se' | 'So' | 'Si' | 'Le' | 'La' | 'Li' | 'Te' | 'Ti';
declare type ChordDegreeNum = 3 | 7 | 9;
declare type ModeType = 'major' | 'minor';
declare type DegreeType = {
    /**
     * 音程
     * 距离I级和弦音程
     */
    interval: number;
    /**
     * 级数
     * 数字标记
     */
    degreeNum: number;
    /**
     * 级数类型
     */
    scale: string;
    /**
     * 唱名
     */
    roll: RollType;
};
declare type Chord = {
    degree: DegreeType;
    tone: ToneSchema;
    chord: Note[];
    chordType: ChordType[];
};

/**
 * 数字级数 => 罗马级数
 * @param degree
 * @returns
 */
declare const getDegreeTag: (degree: string | number) => DegreeTag | "";
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
declare const transChordType: (chords: Tone[], calGrades?: number | undefined) => ChordType[];
/**
 * 五度圈 数组
 * @param root 根音 默认「C」
 */
declare const transFifthsCircle: (root?: Tone) => ToneSchema[];

declare function transNote(x: Tone): Note;
declare function transNote(x: Tone[]): Note[];
declare function transTone(note: Note): ToneSchema;
declare function transTone(note: number): ToneSchema;

/**
 * 0品调音 => 指板二维数组
 * @param zeroGrades 指板0品调音
 * @param GradeLength 指板品数
 * @param baseLevel 基准音高
 * @returns Point[][]
 */
declare const transBoard: (zeroTones?: Tone[], GradeLength?: number, baseLevel?: number) => Point[][];
/**
 * 和弦音名数组 + 指板 => 和弦指法
 * @param chords 和弦音数组
 * @param board 指板数组
 * @param fingerSpan 手指品位跨度
 */
declare const transChordTaps: (tones: Tone[], board?: Point[][], fingerSpan?: number) => {
    chordType: ChordType[];
    chordList: Point[][];
};

declare type BoardOption = {
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
declare type BoardOptionProps = Pick<BoardOption, 'mode' | 'scale' | 'chordNumType' | 'baseTone' | 'baseFret' | 'baseLevel'>;
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

/**
 * 乐理知识配置
 */

/**
 * 音高Interval数组
 */
declare const NOTE_LIST: Note[];
declare const NOTE_FALLING_LIST: NoteFalling[];
declare const INTERVAL_LIST: Interval[];
declare const INTERVAL_FALLING_LIST: IntervalFalling[];
declare const DEFAULT_TUNE: Note[];
declare const DEFAULT_LEVEL = 2;
declare const NOTE_SORT: Note[];
/**
 * 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'
 * https://learningmusic.ableton.com/zh-Hans/advanced-topics/modes.html
 */
declare const MODE_LIST: ModeType[];
declare const DEGREE_TAG_MAP: Record<IntervalNum, DegreeTag>;
/**
 * 品柱数量
 */
declare const GRADE_NUMS = 16;
/**
 * 弦数量
 */
declare const STRING_NUMS = 6;
/**
 * 手指品柱跨度
 */
declare const FINGER_GRADE_NUMS = 4;

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

export { Board, BoardOption, BoardOptionProps, Chord, ChordDegreeNum, ChordType, DEFAULT_LEVEL, DEFAULT_TUNE, DEGREE_TAG_MAP, DegreeTag, DegreeType, FINGER_GRADE_NUMS, GRADE_NUMS, INTERVAL_FALLING_LIST, INTERVAL_LIST, Interval, IntervalAll, IntervalFalling, IntervalNum, MODE_LIST, ModeType, NOTE_FALLING_LIST, NOTE_LIST, NOTE_SORT, Note, NoteFalling, Pitch, Point, RollType, STRING_NUMS, Tone, ToneSchema, ToneTypeName, chordDegreeMap, chordMap, defaultOptions as defaultBoardOptions, degreeMap, getDegreeTag, transBoard, transChord, transChordTaps, transChordType, transFifthsCircle, transNote, transScale, transScaleDegree, transTone };
