/**
 * 和弦分类
 */
const chordMap = new Map<number, ChordType>([
  [43, { tag: '', name: 'major triad' }], // 大三和弦
  [34, { tag: 'm', name: 'minor triad' }], // 小三和弦
  [44, { tag: 'aug', name: 'augmented triad' }], // 增三和弦
  [33, { tag: 'dim', name: 'diminished triad' }], // 减三和弦

  [433, { tag: '7', name: 'seventh chord' }], // 七和弦
  [434, { tag: 'maj7', name: 'major seventh chord' }], // 大七和弦
  [343, { tag: 'm7', name: 'minor seventh chord' }], // 小七和弦
  [344, { tag: 'mM7', name: 'minor major seventh chord' }], // 小大七和弦

  [333, { tag: 'dim7', name: 'diminished seventh chord' }], // 减七和弦
  [334, { tag: 'm7-5', name: 'minor major seventh chord' }], // 半减七和弦
  [442, { tag: '7#5', name: 'minor major seventh chord' }], // 增属七和弦
  [443, { tag: 'mM7', name: 'minor major seventh chord' }], //增大七和弦
])

/**
 * 级数分类
 */
const degreeArr: DegreeType[] = [
  { interval: 0, tag: 'Ⅰ', scale: 'Tonic', roll: 'Do' }, // 主，稳定
  { interval: 2, tag: 'Ⅱ', scale: 'Supertonic', roll: 'Re' }, // 上主
  { interval: 4, tag: 'Ⅲ', scale: 'Mediant', roll: 'Mi' }, // 中，张力很小
  { interval: 5, tag: 'Ⅳ', scale: 'Subdominant', roll: 'Fa' }, // 下属，张力模糊
  { interval: 7, tag: 'Ⅴ', scale: 'Dominant', roll: 'So' }, // 属，张力大而和谐
  { interval: 9, tag: 'Ⅵ', scale: 'Submediant', roll: 'La' }, // 下中
  { interval: 11, tag: 'Ⅶ', scale: 'Leading Tone', roll: 'Ti' }, // 导，张力最大
]

export { chordMap, degreeArr }
