# to-guitar

to-guitar.js for Guitar fretboard and chords
吉他指板/和弦转换 js 库

## Board

吉他指板对象
可设置属性包括 调式、音阶、0 品调音、指板品数、调音高度
可获取属性包括 调式、音阶、和弦类型、顺阶和弦、指板数组

### 基础使用

```js
import { Board } from '@buitar/to-guitar'

const emit = (board) => {
	console.log('The board changed', board)
}
const options = {
	mode: 'major',
	scale: 'C',
}

const board = new Board(emit, options)

board.setOptions({
	scale: 'D',
})
```

## trans

吉他数据转换方法

```js
import { rootToChord, transChordTaps } from '@buitar/to-guitar'

// c_minor_chord = 
// {
// 	"chord": [ "C", "D#", "G" ],
// 	"chordType": {
// 		"tag": "m",
// 		"name": "minor triad",
// 		"constitute": [
// 			"1",
// 			"3b",
// 			"5"
// 		],
// 		"name_zh": "小三和弦"
// 	}
// }
const c_minor_chord = rootToChord('C', 'm') // 获取和弦音

// keyboard_taps = [
// 	{ chordTaps: [...], chordType: {...} },
// 	...
// ]
const keyboard_taps = transChordTaps([ "C", "D#", "G" ]) // 获取和弦吉他指法
```

### trans功能

```js
toDegreeTag, //和弦音 => 和弦名称[]
intervalToSemitones, //度数 => 半音程
rootToChord, //和弦根音 => 和弦
toneToChordType, //和弦 => 和弦名称 & 类型
transScale, //调式 & 调 => 顺阶音调
transScaleDegree, //调式 & 调 => 顺阶和弦
generateFifthCircle, // 五度圈[]

transBoard, // 二维指板数组
transChordTaps, // 和弦指板位置
getModeFregTaps, // 获取调式音阶基础指法(上行 & 下行)
getModeRangeTaps, // 获取指板某范围内某调式音阶
getTapsOnBoard, // 根据指位获取Taps
...
```

# TODO
## 划分层级
1. 必须要 keyboard		「taps」
2. 必须要 12 个音名		 「degrees」
3. 使用音名Note进行计算   「notes」
4. 直接计算音高Tone		 「tones」