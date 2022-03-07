export const typesChecker = (callback?: (pointType: PointType) => void) => {
  let isNote = true
  let isRising = true

  const isNotes = document.getElementsByName('is-note')
  const isRisings = document.getElementsByName('is-rising')

  const getTypes = () => {
    return (
      isNote
        ? isRising
          ? 'note'
          : 'noteFalling'
        : isRising
        ? 'interval'
        : 'intervalFalling'
    ) as PointType
  }

  if (isNotes) {
    isNotes.forEach((type, index) => {
      type.addEventListener('click', () => {
        const temp = index === 0
        if (isNote !== temp) {
          isNote = temp
          callback?.(getTypes())
        }
      })
    })
  }

  if (isRisings) {
    isRisings.forEach((type, index) => {
      type.addEventListener('click', () => {
        const temp = index === 0
        if (isRising !== temp) {
          isRising = temp
          callback?.(getTypes())
        }
      })
    })
  }
}
