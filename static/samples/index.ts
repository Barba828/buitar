const context = require.context('./', true, /\.(mp3)$/)

export const samplesKeys = context.keys()
