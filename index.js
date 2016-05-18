module.exports = function all(o, cb) {
	var responded = false
	var zalgoIsAtTheDoor = true
	var running = 0
	var results = {}
	var errorResponse = null

	if (!o || typeof o !== 'object' || Array.isArray(o)) {
		throw new Error('async-all requires you to pass in an object!')
	}

	function respond() {
		function callCallback() {
			if (typeof cb === 'function') {
				if (errorResponse) {
					cb(errorResponse)
				} else {
					cb(null, results)
				}
			}
		}

		if (zalgoIsAtTheDoor) {
			process.nextTick(callCallback)
		} else {
			callCallback()
		}
	}

	function respondIfItMakesSense() {
		if (running === 0 && !responded) {
			respond()
			responded = true
		}
	}

	var functions = Object.keys(o).filter(function(key) {
		return typeof o[key] === 'function'
	})

	running = functions.length

	Object.keys(o).filter(function(key) {
		return typeof o[key] !== 'function'
	}).forEach(function(key) {
		results[key] = o[key]
	})

	functions.forEach(function(key) {
		var receivedResponse = false
		o[key](function(err, value) {
			if (!receivedResponse) {
				receivedResponse = true
				running--
				if (!errorResponse) {
					if (err) {
						errorResponse = err
					} else {
						results[key] = value
					}
				}
				respondIfItMakesSense()
			}
		})
	})

	respondIfItMakesSense()
	zalgoIsAtTheDoor = false
}
