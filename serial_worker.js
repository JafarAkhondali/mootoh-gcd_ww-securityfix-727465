// Worker for Serial Queue

self.onmessage = function(event) {
	if (event.data.cmd === 'dispatch_async') {
		// eval
		eval('func = ' + event.data.func);
		var result = func();

		// return the result
		postMessage({'count': event.data.count, 'result': result});
	}
}