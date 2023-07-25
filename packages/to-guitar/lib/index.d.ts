type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
type NoteFalling = 'C' | 'Db' | 'D' | 'Eb' | 'E' | 'F' | 'Gb' | 'G' | 'Ab' | 'A' | 'Bb' | 'B';
type Interval = '1' | '1#' | '2' | '2#' | '3' | '4' | '4#' | '5' | '5#' | '6' | '6#' | '7';
type IntervalFalling = '1' | '2b' | '2' | '3b' | '3' | '4' | '5b' | '5' | '6b' | '6' | '7b' | '7';
type IntervalExtended = '8' | '8#' | '9b' | '9' | '9#' | '10b' | '10' | '11' | '11#' | '12b' | '12' | '12#' | '13b' | '13' | '13#' | '14b' | '14';
type IntervalAll = Interval | IntervalFalling | IntervalExtended;
type IntervalNum = 1 | 2 | 3 | 4 | 5 | 6 | 7;
/**
 * 音符类型
 */
type Tone = Note | NoteFalling | Interval | IntervalFalling | IntervalNum;
/**
 * 音符类型ToneType名称
 */
type ToneTypeName = 'note' | 'noteFalling' | 'interval' | 'intervalFalling';
/**
 * 音符Schema
 */
type ToneSchema = {
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
/**
 * 数字音高 0 ～ *
 */
type Pitch = number;
/**
 * 指板音符位置
 */
type Point = {
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
     * 弦位 1弦开始
     * string position
     */
    string: number;
    /**
     * 品位 0品开始
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
/**
 * 吉他某弦指板音符位置
 */
type GuitarString = Point[];
/**
 * 吉他全指板指板音符位置
 */
type GuitarBoard = GuitarString[];

type ChordType = {
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
type DegreeTag = 'Ⅰ' | 'Ⅱ' | 'Ⅲ' | 'Ⅳ' | 'Ⅴ' | 'Ⅵ' | 'Ⅶ';
type RollType = 'Do' | 'Di' | 'Ra' | 'Re' | 'Mi' | 'Fa' | 'Fi' | 'Se' | 'So' | 'Si' | 'Le' | 'La' | 'Li' | 'Te' | 'Ti';
type ChordDegreeNum = 3 | 7 | 9;
/**
 * 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'
 * https://learningmusic.ableton.com/zh-Hans/advanced-topics/modes.html
 */
type ModeType = 'major' | 'minor' | 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian' | 'major-pentatonic' | 'minor-pentatonic' | 'major-blues' | 'minor-blues';
type DegreeType = {
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
type Chord = {
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
declare const transChordType: (chords: Tone[], calGrades?: number) => ChordType[];
/**
 * 五度圈 数组
 * @param root 根音 默认「C」
 */
declare const transFifthsCircle: (root?: Tone) => ToneSchema[];

declare function transNote(x: Tone): Note;
declare function transNote(x: Tone[]): Note[];
declare function transTone(note: Note): ToneSchema;
declare function transTone(note: number): ToneSchema;
declare function transToneNum(x: Tone): Pitch;
declare function transToneNum(x: Tone[]): Pitch[];

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
    chordType: ChordType[];
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

/**
 * 音符基础配置
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
declare const MODE_LIST: ModeType[];
declare const DEGREE_TAG_MAP: Record<IntervalNum, DegreeTag>;
declare const DEGREE_TAG_LIST: DegreeTag[];
/**
 * 品柱数量，即从 0 ～ 16品
 */
declare const GRADE_NUMS = 17;
/**
 * 弦数量
 */
declare const STRING_NUMS = 6;
/**
 * 手指品柱跨度
 */
declare const FINGER_GRADE_NUMS = 4;

/**
 * 和弦配置
 */

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

export { Board, BoardOption, BoardOptionProps, Chord, ChordDegreeNum, ChordType, DEFAULT_LEVEL, DEFAULT_TUNE, DEGREE_TAG_LIST, DEGREE_TAG_MAP, DegreeTag, DegreeType, FINGER_GRADE_NUMS, GRADE_NUMS, GuitarBoard, GuitarString, INTERVAL_FALLING_LIST, INTERVAL_LIST, Interval, IntervalAll, IntervalFalling, IntervalNum, MODE_LIST, ModeType, NOTE_FALLING_LIST, NOTE_LIST, NOTE_SORT, Note, NoteFalling, Pitch, Point, RollType, STRING_NUMS, Tone, ToneSchema, ToneTypeName, chordDegreeMap, chordMap, defaultOptions as defaultBoardOptions, degreeMap, getDegreeTag, getModeFregTaps, getModeRangeTaps, transBoard, transChord, transChordTaps, transChordType, transFifthsCircle, transNote, transScale, transScaleDegree, transTone, transToneNum };
