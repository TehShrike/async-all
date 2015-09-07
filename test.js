var test = require('tape')
var all = require('./')

test('throws on non-object input', function(t) {
	t.throws(function() {
		all([])
	}, 'throws on array')
	t.throws(function() {
		all()
	}, 'throws on undefined')
	t.end()
})

function callbackEventuallyWith(err, value, when) {
	return function(cb) {
		setTimeout(function() {
			cb(err, value)
		}, when)
	}
}

test('collecting with no errors', function(t) {
	all({
		one: callbackEventuallyWith(null, 'value one', 50),
		two: callbackEventuallyWith(null, 'value two', 30)
	}, function(err, result) {
		t.notOk(err, 'no error')
		t.equal(result.one, 'value one')
		t.equal(result.two, 'value two')
		t.end()
	})
})

test('no zalgo', function(t) {
	var zalgo = true
	all({
		one: function(cb) {
			cb(null, 'value')
		}
	}, function(err, result) {
		t.notOk(err, 'no error')
		t.equal(result.one, 'value')
		t.notOk(zalgo)
		t.end()
	})
	zalgo = false
})

test('collecting with an empty object', function(t) {
	var zalgo = true
	all({}, function(err, result) {
		t.notOk(err, 'no error')
		t.notOk(zalgo, 'no zalgo')
		t.end()
	})
	zalgo = false
})

test('collecting with an error', function(t) {
	all({
		one: callbackEventuallyWith(new Error('err'), 'value', 50),
		two: callbackEventuallyWith(null, 'value', 35)
	}, function(err, result) {
		t.ok(err)
		t.notOk(result)
		t.end()
	})
})

test('first error wins', function(t) {
	all({
		one: callbackEventuallyWith(new Error('err1'), 'value', 50),
		two: callbackEventuallyWith(new Error('err2'), 'value', 20)
	}, function(err, result) {
		t.equal(err.message, 'err2')
		t.end()
	})
})

test('regular values', function(t) {
	all({
		one: callbackEventuallyWith(null, 'value', 20),
		two: 'just this string'
	}, function(err, result) {
		t.equal(result.one, 'value')
		t.equal(result.two, 'just this string')
		t.end()
	})
})

test('ignore callbacks after the first one', function(t) {
	var calledAlready = false
	all({
		wat: function(cb) {
			cb(null, 'eh')
			cb(null, 'meh')
			setTimeout(function() {
				cb(null, 'urr')
				t.end()
			}, 50)
		},
		other: callbackEventuallyWith(null, 'whatever', 10)
	}, function(err, result) {
		t.equal(result.wat, 'eh')
		t.notOk(calledAlready)
		calledAlready = true
	})
})
