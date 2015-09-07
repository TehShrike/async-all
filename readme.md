[![Build Status](https://travis-ci.org/TehShrike/async-all.svg)](https://travis-ci.org/TehShrike/async-all)

Run a bunch of asynchronous functions and get all the values at once  at the end!

<!-- js

var fs = require('fs')

function startsWith(haystack, needle) {
	return haystack.indexOf(needle) === 0
}

-->

```js

var all = require('./')

function someAsyncThing(cb) {
	setTimeout(function() {
		cb(null, 'some sweet value')
	}, 50)
}

function someOtherAsyncThing(cb) {
	setTimeout(function() {
		cb(null, 'some other value')
	}, 10)
}

all({
	someValue: someAsyncThing,
	whatever: someOtherAsyncThing
}, function(err, results) {
	results.someValue // => 'some sweet value'
	results.whatever // => 'some other value'
})

all({
	tmp: fs.stat.bind(fs, '/tmp'),
	broken: fs.stat.bind(fs, '/tmp/doesntexist/asfarasIknow')
}, function(err, results) {
	startsWith(err.message, 'ENOENT: no such file or directory') // => true
})

```


# License

[WTFPL](http://wtfpl2.com)
