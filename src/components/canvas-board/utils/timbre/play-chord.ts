// var T = require('timbre')

// function playChord(noteArray: number[]) {
// 	// borrowed from the timbre.js library
// 	// will play an array of frequencies sent to it

// 	// not sure what env does
// 	var env = T('perc', { a: 50, r: 2500 })

// 	// pluck is the timbre.js synthesis of a guitar string being plucked
// 	var pluck = T('PluckGen', { env: env, mul: 0.5 }).bang().play()

// 	// interval allows for a slight delay in the plucking of strings
// 	// basically simulates a strum instead of hitting them all at once

// 	var interval = T('interval', { interval: 75 }, function (count: number) {
// 		// it's iterating through.  This gets the frequency from the current
// 		// position in the array
// 		var noteNum = noteArray[count % noteArray.length]

// 		// no idea what velocity does
// 		var velocity = 64 + (count % 64)

// 		// the timbre.js library wants to keep playing on a loop forever
// 		// checking the count prevents this from happening
// 		if (count <= noteArray.length - 1) {
// 			pluck.noteOnWithFreq(noteNum, velocity)
// 		}
// 	})

// 	// the timeout stops the script from executing after two seconds
// 	T('timeout', { timeout: 2000 })
// 		.on('ended', function () {
// 			this.stop()
// 			// T.stop()
// 		})
// 		.set({ buddies: interval })
// 		.start()
// }

// playChord([131, 196, 262, 329])
