import { renderAbc, Editor } from 'abcjs'
import type { AbcVisualParams } from 'abcjs'

console.log('this is buitar-editor')

const abcString = `X:1
T:The Legacy Jig
M:6/8
L:1/8
R:jig
K:G
GFG BAB | gfg gab | GFG BAB | d2A AFD |
GFG BAB | gfg gab | age edB |1 dBA AFD :|2 dBA ABd |:
efe edB | dBA ABd | efe edB | gdB ABd |
efe edB | d2d def | gfe edB |1 dBA ABd :|2 dBA AFD |]
`
const options: AbcVisualParams = {
	dragColor: 'yellowgreen',
	dragging: false,
	foregroundColor: '#f2f2f2',
    selectionColor: 'rgb(62, 148, 202)',
	tablature: [
		{
			instrument: 'guitar',
			// label: '吉他 (%T)',
			tuning: ['E,', 'A,', 'D', 'G', 'B', 'e'],
		},
	],
    jazzchords: true,
	add_classes: true,
    responsive: "resize" 
}

const editorEl = document.querySelector('#editor')
if (editorEl) {
	editorEl.innerHTML = abcString
}
const editorParams = {
	canvas_id: 'paper',
	warnings_id: 'warnings',
	abcjsParams: options,
} 
const editor = new Editor('editor', editorParams)
