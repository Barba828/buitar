import ReactDOM from 'react-dom'
import { App } from './app'
import * as toGuitar from '@buitar/to-guitar'
import './style/global.scss'

window.toGuitar = toGuitar

ReactDOM.render(App(), document.getElementById('app'))
