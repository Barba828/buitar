/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

/**
 * 乐理知识配置
 */
/**
 * 音高Interval数组
 */
var NOTE_LIST = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
var NOTE_FALLING_LIST = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
var INTERVAL_LIST = ['1', '1#', '2', '2#', '3', '4', '4#', '5', '5#', '6', '6#', '7'];
var INTERVAL_FALLING_LIST = ['1', '2b', '2', '3b', '3', '4', '5b', '5', '6b', '6', '7b', '7'];
var DEFAULT_TUNE = ['E', 'A', 'D', 'G', 'B', 'E'];
var DEFAULT_LEVEL = 2;
var NOTE_SORT = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
/**
 * 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'
 * https://learningmusic.ableton.com/zh-Hans/advanced-topics/modes.html
 */
var MODE_LIST = ['major', 'minor'];
var DEGREE_TAG_MAP = {
    1: 'Ⅰ',
    2: 'Ⅱ',
    3: 'Ⅲ',
    4: 'Ⅳ',
    5: 'Ⅴ',
    6: 'Ⅵ',
    7: 'Ⅶ',
};
// export const SEMITONES_LENGTH = NOTE_LIST.length
/**
 * 品柱数量
 */
var GRADE_NUMS = 16;
/**
 * 弦数量
 */
var STRING_NUMS = 6;
/**
 * 手指品柱跨度
 */
var FINGER_GRADE_NUMS = 4;

/**
 * 和弦乐理配置
 */
/**
 * 和弦分类
 */
var chordMap = new Map([
    /**
     * 三和弦
     */
    [43, { tag: '', name: 'major triad', constitute: ['1', '3', '5'], name_zh: '大三和弦' }],
    [44, { tag: 'aug', name: 'augmented triad', constitute: ['1', '3', '5#'], name_zh: '增三和弦' }],
    [34, { tag: 'm', name: 'minor triad', constitute: ['1', '3b', '5'], name_zh: '小三和弦' }],
    [33, { tag: 'dim', name: 'diminished triad', constitute: ['1', '3b', '5b'], name_zh: '减三和弦' }],
    [25, { tag: 'sus2', name: 'suspended 2 chord', constitute: ['1', '2', '5'], name_zh: '挂二和弦' }],
    [52, { tag: 'sus4', name: 'suspended 4 chord', constitute: ['1', '4', '5'], name_zh: '挂四和弦' }],
    [223, { tag: 'add9', name: 'addition 9 chord', constitute: ['1', '3', '5', '9'], name_zh: '加九和弦' }],
    [214, { tag: 'madd9', name: 'minor addition 9 chord', constitute: ['1', '3b', '5', '9'], name_zh: '小加九和弦' }],
    [412, { tag: 'add11', name: 'addition 11 chord', constitute: ['1', '3', '5', '11'], name_zh: '加十一和弦' }],
    [322, { tag: 'madd11', name: 'minor addition 11 chord', constitute: ['1', '3b', '5', '11'], name_zh: '小加十一和弦' }],
    /**
     * 七和弦
     */
    [434, { tag: 'maj7', name: 'major seventh chord', constitute: ['1', '3', '5', '7'], name_zh: '大七和弦' }],
    [433, { tag: '7', name: 'seventh chord', constitute: ['1', '3', '5', '7b'], name_zh: '属七和弦' }],
    [343, { tag: 'm7', name: 'minor seventh chord', constitute: ['1', '3b', '5', '7b'], name_zh: '小七和弦' }],
    [334, { tag: 'm7b5' /**'m7-5' */, name: 'half-diminished seventh chord', constitute: ['1', '3b', '5b', '7b'], name_zh: '半减七和弦' }],
    [333, { tag: 'dim7', name: 'diminished seventh chord', constitute: ['1', '3b', '5b', '6'], name_zh: '减七和弦' }],
    [344, { tag: 'mM7', name: 'minor major seventh chord', constitute: ['1', '3b', '5', '7'], name_zh: '小大七和弦' }],
    [443, { tag: 'augM7' /**'M7#5' */, name: 'augmented major seventh chord', constitute: ['1', '3', '5#', '7'], name_zh: '增大七和弦' }],
    [442, { tag: 'aug7' /**'7#5' */, name: 'augmented seventh chord', constitute: ['1', '3', '5#', '7b'], name_zh: '增属七和弦' }],
    [523, { tag: '7sus4', name: 'seventh suspended 4 chord', constitute: ['1', '4', '5', '7b'], name_zh: '属七挂四和弦' }],
    [432, { tag: '6', name: 'sixth chord', constitute: ['1', '3', '5', '6'], name_zh: '大六和弦' }],
    [342, { tag: 'm6', name: 'minor sixth chord', constitute: ['1', '3b', '5', '6'], name_zh: '小六和弦' }],
    [341, { tag: 'mb6', name: 'minor sixth chord', constitute: ['1', '3b', '5', '6b'], name_zh: '减六和弦?' }],
    /**
     * 七和弦拓展
     */
    [1333, { tag: '7(b9)', name: 'seventh(b-ninth) chord', constitute: ['1', '3', '5', '7b', '9b'], name_zh: '属七(b9)和弦' }],
    [3133, { tag: '7(#9)', name: 'seventh(#-ninth) chord', constitute: ['1', '3', '5', '7b', '9#'], name_zh: '属七(#9)和弦' }],
    [4313, { tag: '7(#11)', name: 'seventh(#-eleventh) chord', constitute: ['1', '3', '5', '7b', '11#'], name_zh: '属七(#11)和弦' }],
    [4312, { tag: '7(b13/#5)', name: 'seventh(#-fifth) chord', constitute: ['1', '3', '5', '7b', '13b'], name_zh: '属七(b13/#5)和弦' }],
    /**
     * 九和弦
     * 计算复音程真TMD麻烦
     */
    [2234, { tag: 'maj9', name: 'major ninth chord', constitute: ['1', '3', '5', '7', '9'], name_zh: '大九和弦' }],
    [2233, { tag: '9', name: 'ninth chord', constitute: ['1', '3', '5', '7b', '9'], name_zh: '属九和弦' }],
    [2143, { tag: 'm9', name: 'minor ninth chord', constitute: ['1', '3b', '5', '7b', '9'], name_zh: '小九和弦' }],
    [2134, { tag: 'dim9-5', name: 'half-diminished ninth chord', constitute: ['1', '3b', '5b', '7b', '9'], name_zh: '半减九和弦' }],
    [2133, { tag: 'dim9', name: 'diminished ninth chord', constitute: ['1', '3b', '5b', '6', '9'], name_zh: '减九和弦' }],
    [2144, { tag: 'mM9', name: 'minor major ninth chord', constitute: ['1', '3b', '5', '7', '9'], name_zh: '小大九和弦' }],
    [2243, { tag: 'augM9', name: 'augmented major ninth chord', constitute: ['1', '3', '5#', '7', '9'], name_zh: '增大九和弦' }],
    [2242, { tag: 'aug9', name: 'augmented ninth chord', constitute: ['1', '3', '5#', '7b', '9'], name_zh: '增九和弦' }],
    [2323, { tag: '9sus4', name: 'suspended 4 chord', constitute: ['1', '4', '5', '7b', '9'], name_zh: '属九挂四和弦' }],
    [2232, { tag: '69', name: 'sixth ninth chord', constitute: ['1', '3', '5', '6', '9'], name_zh: '六九和弦' }],
    [2142, { tag: 'm69', name: 'minor sixth ninth chord', constitute: ['1', '3b', '5', '6', '9'], name_zh: '小六九和弦' }],
    [2141, { tag: 'mb69', name: 'minor b-sixth ninth chord', constitute: ['1', '3b', '5', '6b', '9'], name_zh: '小减六九和弦?' }],
    /**
     * 十一和弦
     */
    [22214, { tag: 'maj#11', name: 'major #-eleventh chord', constitute: ['1', '3', '5', '7', '9', '11#'], name_zh: '大升十一和弦' }],
    [22123, { tag: '11', name: 'eleventh chord', constitute: ['1', '3', '5', '7b', '9', '11'], name_zh: '属十一和弦' }],
    [21223, { tag: 'm11', name: 'minor eleventh chord', constitute: ['1', '3b', '5', '7b', '9', '11'], name_zh: '小十一和弦' }],
    /**
     * 十三和弦
     */
    [222122, { tag: 'maj13', name: 'major eleventh chord', constitute: ['1', '3', '5', '7', '9', '11#', '13'], name_zh: '大十三和弦' }],
    [221221, { tag: '13', name: 'eleventh chord', constitute: ['1', '3', '5', '7b', '9', '11', '13'], name_zh: '属十三和弦' }],
    [212221, { tag: 'm13', name: 'minor eleventh chord', constitute: ['1', '3b', '5', '7b', '9', '11', '13'], name_zh: '小十三和弦' }],
]);
/**
 * 和弦级数分类
 */
var degreeMap = new Map([
    [
        'major',
        [
            { interval: 0, degreeNum: 1, scale: 'Tonic', roll: 'Do' },
            { interval: 2, degreeNum: 2, scale: 'Supertonic', roll: 'Re' },
            { interval: 4, degreeNum: 3, scale: 'Mediant', roll: 'Mi' },
            { interval: 5, degreeNum: 4, scale: 'Subdominant', roll: 'Fa' },
            { interval: 7, degreeNum: 5, scale: 'Dominant', roll: 'So' },
            { interval: 9, degreeNum: 6, scale: 'Submediant', roll: 'La' },
            { interval: 11, degreeNum: 7, scale: 'Leading Tone', roll: 'Ti' }, // 导，张力最大
        ],
    ],
    [
        'minor',
        [
            { interval: 0, degreeNum: 1, scale: 'Tonic', roll: 'Do' },
            { interval: 2, degreeNum: 2, scale: 'Supertonic', roll: 'Re' },
            { interval: 3, degreeNum: 3, scale: 'Mediant', roll: 'Mi' },
            { interval: 5, degreeNum: 4, scale: 'Subdominant', roll: 'Fa' },
            { interval: 7, degreeNum: 5, scale: 'Dominant', roll: 'So' },
            { interval: 8, degreeNum: 6, scale: 'Submediant', roll: 'Le' },
            { interval: 10, degreeNum: 7, scale: 'SubTonic', roll: 'Te' }, // 下主 和声小调/旋律小调 interval = 11, roll = 'Ti' 即为 导音
        ],
    ],
    // @todo [...]
]);
/**
 * 顺接和弦级数
 * 三和弦/七和弦/九和弦
 */
var chordDegreeMap = new Map([
    [
        3,
        {
            name: 'triad',
            interval: [1, 3, 5],
        },
    ],
    [
        7,
        {
            name: 'seventh chord',
            interval: [1, 3, 5, 7],
        },
    ],
    [
        9,
        {
            name: 'ninth chord',
            interval: [1, 3, 5, 7, 9], // 九音是严格的根音的大二度
        },
    ],
]);

/**
 * Tone音字符 => 标准Note字符
 * @param x
 * @returns Note
 */
function transNote(x) {
    if (x instanceof Array) {
        return x.map(function (x) { return transNote(x); });
    }
    return isNote(x)
        ? x
        : isNoteFalling(x)
            ? NOTE_LIST[NOTE_FALLING_LIST.indexOf(x)]
            : isInterval(x)
                ? NOTE_LIST[INTERVAL_LIST.indexOf(x)]
                : isIntervalNum(x)
                    ? NOTE_LIST[INTERVAL_LIST.indexOf(x.toString())]
                    : NOTE_LIST[INTERVAL_FALLING_LIST.indexOf(x)];
}
/**
 * Note or NoteIndex => Tone所有类型字符
 * @param note
 * @returns toneSchema
 */
function transTone(note) {
    var index = 0;
    if (typeof note === 'number') {
        index = note;
    }
    else {
        index = NOTE_LIST.indexOf(note);
    }
    return {
        note: NOTE_LIST[index],
        noteFalling: NOTE_FALLING_LIST[index],
        interval: INTERVAL_LIST[index],
        intervalFalling: INTERVAL_FALLING_LIST[index],
        index: index,
    };
}
var isNote = function (x) {
    return NOTE_LIST.includes(x);
};
var isNoteFalling = function (x) {
    return NOTE_FALLING_LIST.includes(x);
};
var isInterval = function (x) {
    return INTERVAL_LIST.includes(x);
};
var isIntervalNum = function (x) {
    return typeof x === 'number';
};

/**
 * 和弦音 => 和弦名称[]
 * @param chords
 */
var getChordType = function (chords) {
    var tone = transTone(chords[0]);
    var chordList = [];
    // 遍历和弦音中每个音当根音当情况（cover转位和弦）
    chords.forEach(function (chord, index) {
        // 根音偏移
        var offset = NOTE_LIST.indexOf(chord);
        var rest = __spreadArray([], chords, true);
        rest.splice(index, 1);
        // 放置根音并对后面的音进行排序（设置offset便于排序，即排序结果根音恒在数组首位）
        var intervals = __spreadArray([chord], rest, true).map(function (item) {
            return NOTE_LIST.indexOf(item) - offset >= 0 ? NOTE_LIST.indexOf(item) - offset : NOTE_LIST.indexOf(item) - offset + NOTE_LIST.length;
        })
            .sort(function (a, b) { return a - b; });
        // 排序完成根据音程计算key
        var key = intervals.reduce(function (pre, cur, curIndex) { return pre * 10 + (cur - intervals[curIndex - 1] || 0); }, 0);
        var chordItem = chordMap.get(key);
        if (chordItem) {
            chordList.push(__assign({ tone: tone, over: transTone(NOTE_LIST[offset]) }, chordItem));
        }
    });
    return chordList;
};
/**
 * 数字级数 => 罗马级数
 * @param degree
 * @returns
 */
var getDegreeTag = function (degree) {
    var _a;
    var num = (_a = degree.toString().match(/[1-7]/g)) === null || _a === void 0 ? void 0 : _a[0];
    if (!num) {
        return '';
    }
    return DEGREE_TAG_MAP[Number(num)];
};
/**
 * 和弦根音 => 和弦
 * @param tone 根音
 * @param chordTypeTag 和弦类型标记（'m'|'aug'|'dim'|...）
 * @returns
 */
var transChord = function (tone, chordTypeTag) {
    if (chordTypeTag === void 0) { chordTypeTag = ''; }
    var note = transNote(tone);
    var chordTypeItem = Array.from(chordMap.entries()).find(function (_a) {
        _a[0]; var value = _a[1];
        return value.tag === chordTypeTag;
    });
    if (!chordTypeItem) {
        return null;
    }
    var key = chordTypeItem[0], chordType = chordTypeItem[1];
    var intervals = [NOTE_LIST.indexOf(note)];
    var intervalNums = key
        .toString()
        .split('')
        .map(function (item) { return parseInt(item); });
    intervalNums.reduce(function (preNum, curNum) {
        var temp = (preNum + curNum) % NOTE_LIST.length;
        intervals.push(temp);
        return temp;
    }, intervals[0]);
    var chord = intervals.map(function (interval) { return NOTE_LIST[interval]; });
    return {
        chord: chord,
        chordType: chordType,
    };
};
/**
 * 调式 & 调 => 顺阶音调
 * @param {
 *  @attr mode 调式 默认「major自然大调」
 *  @attr scale 大调音阶 默认「C调」
 * }
 * @returns 大调音阶顺阶音调 数组
 */
var transScale = function (_a) {
    var _b = _a.mode, mode = _b === void 0 ? 'major' : _b, _c = _a.scale, scale = _c === void 0 ? 'C' : _c;
    var note = transNote(scale);
    var degreeArr = degreeMap.get(mode);
    if (!degreeArr || !note) {
        return [];
    }
    var initIndex = NOTE_LIST.indexOf(note);
    var noteLength = NOTE_LIST.length;
    // 根据大调顺阶degreeArr转换大调
    return degreeArr.map(function (degree) {
        var curIndex = (initIndex + degree.interval) % noteLength;
        var tone = transTone(curIndex);
        return {
            degree: degree,
            tone: tone,
            chord: [],
            chordType: [],
        };
    });
};
/**
 * 调式 & 调 => 顺阶和弦
 * @param {
 *  @attr mode 调式 默认「major自然大调」
 *  @attr scale 大调音阶 默认「C调」
 *  @attr chordNumType 和弦类型 默认「3和弦」
 * }
 * @returns 大调音阶顺阶和弦 数组
 */
var transScaleDegree = function (_a) {
    var _b;
    var _c = _a.mode, mode = _c === void 0 ? 'major' : _c, _d = _a.scale, scale = _d === void 0 ? 'C' : _d, _e = _a.chordNumType, chordNumType = _e === void 0 ? 3 : _e;
    var degrees = transScale({ mode: mode, scale: scale });
    var degreeLength = degrees.length;
    var chordScale = ((_b = chordDegreeMap.get(chordNumType)) === null || _b === void 0 ? void 0 : _b.interval) || []; // 顺阶和弦级数增量
    // 根据转换的大调获取大调和弦
    degrees.forEach(function (degree, index) {
        degree.chord = chordScale.map(function (scale) { return degrees[(index + scale - 1) % degreeLength].tone.note; });
        if (chordNumType === 9) {
            // 九和弦的九度音（最后一位）与根音关系必须是大二度，比如 E 的九音是 F#，而不是 F
            var ninthIndex = (NOTE_LIST.indexOf(degree.chord[0]) + 2) % NOTE_LIST.length;
            degree.chord.splice(4);
            degree.chord.push(NOTE_LIST[ninthIndex]);
        }
        degree.chordType = getChordType(degree.chord);
    });
    return degrees;
};
/**
 * 和弦 => 和弦名称 & 类型
 * @param chords 和弦音数组
 * @param calGrades 升降度数 默认不变调
 */
var transChordType = function (chords, calGrades) {
    var chordNotes = transNote(chords);
    if (calGrades) {
        chordNotes = chordNotes
            .map(function (note) { return NOTE_LIST.indexOf(note); })
            .map(function (tone) { return (tone + calGrades) % NOTE_LIST.length; })
            .map(function (calTone) { return NOTE_LIST[calTone]; });
    }
    return getChordType(chordNotes);
};
/**
 * 五度圈 数组
 * @param root 根音 默认「C」
 */
var transFifthsCircle = function (root) {
    if (root === void 0) { root = 'C'; }
    var note = transNote(root);
    var basicIndex = NOTE_LIST.indexOf(note);
    var step = 7; // 纯五度 Perfect 5th 半音数
    return new Array(NOTE_LIST.length).fill(1).map(function (_, index) {
        var curIndex = (step * index + basicIndex) % NOTE_LIST.length;
        return transTone(curIndex);
    });
};

/**
 * 便于计算，默认调音一线零品为低音，即
 * 数字 0~11 => 低音 C~B
 * 数字 12~23 => 标音 C~B
 * 数字 24~35 => 高音 C~B
 *
 * 标准调弦吉他：['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
 * 即绝对音高为：[4, 9, 14, 19, 23, 28]
 */
/**
 * 调音 => 绝对音高 (单调递增)
 * @param zeroTones 0品调音
 * @returns pitchs 绝对音高数组
 */
var getAdditionPitchs = function (zeroTones) {
    if (zeroTones === void 0) { zeroTones = DEFAULT_TUNE; }
    var zeroNotes = transNote(zeroTones);
    var pitchs = [NOTE_LIST.indexOf(zeroNotes[0])];
    var upKey = 0;
    for (var index = 1; index < zeroNotes.length; index++) {
        var note = zeroNotes[index];
        var tone = NOTE_LIST.indexOf(note);
        if (tone + upKey * NOTE_LIST.length < pitchs[index - 1]) {
            upKey++;
        }
        pitchs.push(tone + upKey * NOTE_LIST.length);
    }
    return pitchs;
};
/**
 * 0品调音 => 指板二维数组
 * @param zeroGrades 指板0品调音
 * @param GradeLength 指板品数
 * @param baseLevel 基准音高
 * @returns Point[][]
 */
var transBoard = function (zeroTones, GradeLength, baseLevel) {
    if (zeroTones === void 0) { zeroTones = DEFAULT_TUNE; }
    if (GradeLength === void 0) { GradeLength = GRADE_NUMS; }
    if (baseLevel === void 0) { baseLevel = DEFAULT_LEVEL; }
    var zeroPitchs = getAdditionPitchs(zeroTones);
    var boardNums = zeroPitchs.map(function (zeroPitch, stringIndex) {
        var stringNums = [];
        for (var grade = 0; grade < GradeLength; grade++) {
            var pitch = zeroPitch + grade;
            var tone = pitch % NOTE_LIST.length;
            var toneSchema = transTone(tone);
            var index = stringIndex * GradeLength + grade;
            var level = Math.floor(pitch / NOTE_LIST.length) + baseLevel;
            toneSchema.level = level;
            var point = {
                tone: tone,
                pitch: pitch,
                toneSchema: toneSchema,
                string: stringIndex + 1,
                grade: grade,
                index: index,
            };
            stringNums[grade] = point;
        }
        return stringNums;
    });
    return boardNums;
};
/**
 * 和弦音名数组 + 指板 => 和弦指法
 * @param chords 和弦音数组
 * @param board 指板数组
 * @param fingerSpan 手指品位跨度
 */
var transChordTaps = function (tones, board, fingerSpan) {
    if (board === void 0) { board = transBoard(); }
    if (fingerSpan === void 0) { fingerSpan = FINGER_GRADE_NUMS; }
    var chords = transNote(tones);
    var root = chords[0]; //当前根音
    var roots = []; // 指板上的所有根音 数组
    var tapsList = []; // 指板上所有的符合的和弦 数组
    // 检索根音位置
    board.forEach(function (grades, stringIndex) {
        // 有几根弦 > 和弦音数
        if (stringIndex > board.length - chords.length || stringIndex > 2) {
            // 遍历到四弦返回（一般不参考只有三根弦的和弦）
            return;
        }
        grades.forEach(function (point) {
            // 根音位置也在第一个八度内（12品）
            if (point.toneSchema.note === root && point.grade < 12) {
                roots.push(point);
            }
        });
    });
    /**
     * 递归获取当前弦之后所有符合和弦音的和弦列表
     * @param stringIndex 当前弦下标
     * @param taps 递归当前和弦列表
     */
    var findNextString = function (stringIndex, taps) {
        if (stringIndex >= board.length) {
            tapsList.push(taps);
            return;
        }
        // 暂不考虑跳过当前弦选下一根弦的情况
        // findNextString(stringIndex + 1, [...taps])
        var grades = board[stringIndex];
        grades.forEach(function (point) {
            if (chords.includes(point.toneSchema.note)) {
                // 若和其他按位品位不超过4，或者该品是0品，则加入指位
                if (taps.every(function (tap) { return Math.abs(tap.grade - point.grade) < fingerSpan; }) || point.grade === 0) {
                    findNextString(stringIndex + 1, __spreadArray(__spreadArray([], taps, true), [point], false));
                }
            }
        });
    };
    // 获取所有根音下的和弦列表
    roots.forEach(function (point) {
        findNextString(point.string, [point]);
    });
    /**
     * 过滤 和弦指法手指按位超过 fingerSpan（正常指法不超过4根手指）
     * 		& 手指不超过 1
     * 		& 最小品不超过 12 （超过12品重复的八度音高）
     * @param taps
     */
    var fingersFilter = function (taps) {
        // 最小品位（最小品位超过1，则为横按指法）
        var minGrade = Math.min.apply(Math, taps.map(function (tap) { return tap.grade; }));
        var fingerNums = minGrade > 0 ? 1 : 0;
        taps.forEach(function (tap) {
            if (tap.grade > minGrade) {
                fingerNums++;
            }
        });
        return fingerNums <= fingerSpan && fingerNums > 1 && minGrade < 12;
    };
    /**
     * 过滤 非完整和弦音组成
     * @param taps
     */
    var integrityFilter = function (taps) {
        var notes = new Set(taps.map(function (tap) { return tap.toneSchema.note; }));
        return notes.size === chords.length;
    };
    /**
     * 排序 根据该和弦品位从低至高
     * @param tapsA
     * @param tapsB
     */
    var gradeSorter = function (tapsA, tapsB) {
        var maxGradeA = Math.max.apply(Math, tapsA.map(function (tap) { return tap.grade; }));
        var maxGradeB = Math.max.apply(Math, tapsB.map(function (tap) { return tap.grade; }));
        return maxGradeA - maxGradeB;
    };
    var chordType = transChordType(chords);
    var chordList = tapsList.filter(integrityFilter).filter(fingersFilter).sort(gradeSorter);
    return { chordType: chordType, chordList: chordList };
};

var FRAME_TIMER = 16;
var debounce = function (fn, wait) {
    if (wait === void 0) { wait = FRAME_TIMER; }
    var timer;
    return function (args) {
        clearTimeout(timer);
        timer = setTimeout(function () { return fn(args); }, wait);
    };
};
var OnChange = function (target, callback) {
    var debounceCallback = debounce(function () {
        callback(target);
    });
    return new Proxy(target, {
        set: function (target, property, value) {
            target[property] = value;
            debounceCallback();
            return true;
        },
    });
};

var defaultOptions = {
    mode: 'major',
    scale: 'C',
    chordNumType: 3,
    baseTone: DEFAULT_TUNE,
    baseFret: GRADE_NUMS,
    baseLevel: DEFAULT_LEVEL,
};
var Board = /** @class */ (function () {
    /**
     * 指板图
     * @param emit 指板数据修改回调函数
     * @param options 配置
     */
    function Board(emit, options) {
        var _this = this;
        this.emit = emit;
        /**
         * 设置Board属性，自动emit
         * @param options
         */
        this.setOptions = function (options) {
            var _options = __assign(__assign({}, _this._board), options);
            var keys = Object.keys(options);
            /**
             * 更新 options 需要更新 顺阶和弦
             */
            if (keys.includes('mode') || keys.includes('scale') || keys.includes('chordNumType')) {
                var chords = _this.getChords(_options);
                _options.chords = chords;
            }
            /**
             * 更新 options 需要更新 指板
             */
            if (keys.includes('baseTone') || keys.includes('baseFret') || keys.includes('baseLevel')) {
                var keyboard = _this.getKeyBoard(_options);
                _options.keyboard = keyboard;
            }
            Object.assign(_this._board, _options);
        };
        this.getKeyBoard = function (options) {
            return transBoard(options.baseTone, options.baseFret, options.baseLevel);
        };
        this.getChords = function (options) {
            return transScaleDegree({ mode: options.mode, scale: options.scale, chordNumType: options.chordNumType });
        };
        /**
         * 自定义 Keyboard point
         * @param points
         */
        this.setKeyboardStatus = function (points) {
            points.forEach(function (point) {
                var boardPoint = _this._board.keyboard[point.string][point.grade];
                if (boardPoint) {
                    _this._board.keyboard[point.string][point.grade] = __assign(__assign({}, boardPoint), point);
                }
            });
        };
        this.resetKeyboardStatus = function () {
            _this._board.keyboard = _this.getKeyBoard(_this._board);
        };
        var _options = __assign(__assign({}, defaultOptions), options);
        var keyboard = this.getKeyBoard(_options);
        var chords = this.getChords(_options);
        this._board = OnChange(__assign(__assign({}, _options), { chords: chords, keyboard: keyboard }), function () {
            _this.emit(__assign({}, _this._board));
        });
    }
    Object.defineProperty(Board.prototype, "board", {
        get: function () {
            return this._board;
        },
        enumerable: false,
        configurable: true
    });
    return Board;
}());

export { Board, DEFAULT_LEVEL, DEFAULT_TUNE, DEGREE_TAG_MAP, FINGER_GRADE_NUMS, GRADE_NUMS, INTERVAL_FALLING_LIST, INTERVAL_LIST, MODE_LIST, NOTE_FALLING_LIST, NOTE_LIST, NOTE_SORT, STRING_NUMS, chordDegreeMap, chordMap, defaultOptions as defaultBoardOptions, degreeMap, getDegreeTag, transBoard, transChord, transChordTaps, transChordType, transFifthsCircle, transNote, transScale, transScaleDegree, transTone };

if(typeof window !== 'undefined') {
  window._Dry_VERSION_ = '0.0.13'
}
//# sourceMappingURL=index.esm.js.map
