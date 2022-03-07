export const chordsChecker = (chordList :Point[][], callback?: (points: Point[], index?: number) => void) => {
  const chords = document.createElement('form')
  chords.setAttribute('style', 'display: flex;flex-direction: column;')

  chordList.forEach((item, index) => {
    const chordView = document.createElement('div')
    
    const chordRadio = document.createElement('input')
    chordRadio.setAttribute('name', 'check-chord')
    chordRadio.setAttribute('type', 'radio')
    chordRadio.addEventListener('click', () => {
      callback?.(item, index)
    })
    const chordText = document.createTextNode(`${item[0].string} string ${item[0].grade} grade `)
    
    chordView.appendChild(chordRadio)
    chordView.appendChild(chordText)

    chords.appendChild(chordView)
  })

  document.getElementById('tools')?.appendChild(chords)
}