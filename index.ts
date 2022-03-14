// import { app } from './components/index'

// app()
import react from 'react'
import ReactDOM from 'react-dom'

import { test } from './components/test'

ReactDOM.render(test, document.getElementById('app'))

console.log('lnz', document.getElementById('app'))
document.getElementById('app')?.appendChild(document.createElement('p'))
