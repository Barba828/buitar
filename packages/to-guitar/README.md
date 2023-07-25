# to-guitar

to-guitar.js for Guitar fretboard and chords
吉他指板/和弦转换 js 库

## Board

吉他指板对象
可设置属性包括 调式、音阶、0 品调音、指板品数、调音高度
可获取属性包括 调式、音阶、和弦类型、顺阶和弦、指板数组

```js
/**
 * 默认指板
 * @param emit 指板数据修改回调函数
 * @param options 配置
 */
const board = new Board(emit, options)
```

基础使用

```js
const emit = (board) => {
	console.log(board)
}
const options = {
	mode: 'major',
	scale: 'C',
}

const board = new Board(emit, options)

board.setOptions({
	scale: 'D',
}) // 更新后会默认执行emit
```

## trans

吉他数据转换方法

```js
transChord //和弦根音 => 和弦
transChordType //和弦 => 和弦名称 & 类型
transScale //调式 & 调 => 顺阶音调
transScaleDegree //调式 & 调 => 顺阶和弦
transFifthsCircle // 五度圈[]
...
```
