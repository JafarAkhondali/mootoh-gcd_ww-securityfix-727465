// Worker for Serial Queue

self.onmessage = function(event) {
	var cmd = event.data.cmd;
	switch (cmd) {
		case 'on_create':
			self.id = event.data.id;
			break;
		case 'dispatch_async':
			// eval
			eval('func = ' + event.data.func);
			var result = func(event.data.args);

			// return the result
			postMessage({'count': event.data.count, 'result': result, 'id': self.id});
			break;
		default:
			break;
	}
}