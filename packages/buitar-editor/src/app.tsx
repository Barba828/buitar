import React, { FC, useEffect, useRef, useState } from 'react'
import { Editor } from 'abcjs'
import { printElement } from './utils'
import type { AbcVisualParams, EditorOptions } from 'abcjs'

import './app.scss'
import './abcjs-audio.css'

const abcDefaultString = `
X:1
T:The Legacy Jig
M:6/8
L:1/8
R:jig
K:G
GFG BAB | gfg gab | GFG BAB | d2A AFD |
GFG BAB | gfg gab | age edB |1 dBA AFD :|2 dBA ABd |:
efe edB | dBA ABd | efe edB | gdB ABd |
efe edB | d2d def | gfe edB |1 dBA ABd :|2 dBA AFD |]`

interface AbcVisualParamsExtend extends AbcVisualParams {
	[key: string]: any
}
const defaultAbcjsParams: AbcVisualParamsExtend = {
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
	responsive: 'resize',
}

export interface ABCEditorInterface {
	abcjsParams?: AbcVisualParams
	editorOptions?: EditorOptions
	defaultString?: string
	warningVisible?: boolean
}

export const ABCEditor: FC<ABCEditorInterface> = ({
	abcjsParams,
	editorOptions,
	defaultString,
	warningVisible = true,
}) => {
	const [abcString, setAbcString] = useState(defaultString || abcDefaultString)
	const editorRef = useRef<Editor>()
	useEffect(() => {
		const abcjsMergeParams = {
			...defaultAbcjsParams,
			...abcjsParams,
		}
		const editorParams = {
			...editorOptions,
			canvas_id: 'paper',
			warnings_id: 'warnings',
			synth: {
				el: '#audio',
				options: {
					displayRestart: true,
					displayPlay: true,
					displayProgress: true,
					displayWarp: true,
				},
				cursorControl: {},
			},
			abcjsParams: abcjsMergeParams,
		}

		editorRef.current = new Editor('editor', editorParams as EditorOptions)
	}, [])

	return (
		<div id="abc-editor" className='print-visible'>
			<div id="editor-container">
				<textarea id="editor" defaultValue={abcString}></textarea>
				<div id="audio"></div>
				{warningVisible && <div id="warnings"></div>}
			</div>
			<div id="paper"></div>
			<button id="printer" onClick={() => printElement('paper')}>
				Print
			</button>
		</div>
	)
}

export const App = () => {
	return <ABCEditor />
}
