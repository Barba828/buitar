const context = require.context('./', true, /\.ogg$/)

export const samplesKys = context.keys()
