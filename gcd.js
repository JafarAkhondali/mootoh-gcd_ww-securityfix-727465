// gcd.js

var GCD = {};

var AsyncWorker = function(queue, id) {
	this.queue = queue;
	this.id = id;
	this.callbacks = {};
	this.asyncCount = 0;

	var worker = new Worker('worker.js');
	worker.postMessage({'cmd': 'on_create', 'id': id});
	var self = this;

	worker.onmessage = function(event) {
		var cb = self.callbacks[event.data.count];
		console.log('[' + event.data.id + ']' + ' result:' + event.data.result);
		if (cb) {
			cb();
		}
	};

	worker.onerror = function(error) {
		console.log('error in worker: [' + error.filename + ':' + error.lineno + '] ' + error.message);
	};
	this.worker = worker;
};

AsyncWorker.prototype.dispatch_async = function(func, callback, args) {
	this.asyncCount++;
	this.worker.postMessage({'cmd': 'dispatch_async', 'func': func.toString(), 'args': args, 'count': this.asyncCount});
	this.callbacks[this.asyncCount] = callback;
};


var SerialQueue = function() {
	this.worker = new AsyncWorker(this);
};

SerialQueue.prototype.dispatch_async = function(func, callback) {
	this.worker.dispatch_async(func, callback);
};


var ConcurrentQueue = function() {
	this.NUM_WORKERS = 4;

	this.workers = [];
	for (var i=0; i<this.NUM_WORKERS; i++)
		this.workers.push(new AsyncWorker(this, i));

	this.current = 0;
};

ConcurrentQueue.prototype.dispatch_async = function(func, callback, args) {
	// Simply round-robin scheduling
	this.workers[this.current++].dispatch_async(func, callback, args);
	if (this.current >= this.NUM_WORKERS)
		this.current = 0;
};


var Q = function(isConcurrent) {
	if (isConcurrent)
		this.queue = new ConcurrentQueue();
	else
		this.queue = new SerialQueue();
};

Q.prototype.dispatch_async = function(func, callback, args) {
	this.queue.dispatch_async(func, callback, args);
};

GCD.queue = Q;

//
// Helper methods
//
GCD.mainQueue = function() {
	console.log('main');
	return 1;
};

GCD.globalQueue = function() {
	console.log('global');
	return 2;
};

//
// Tests
//
var q = new GCD.queue(true);

q.dispatch_async(function() {
	var b = 1 + 3;
	return b;
}, function() {
	console.log('callbacked');
});

q.dispatch_async(function(arr) {
	return arr.length;
	// return 2 + 3;
}, function() {
	console.log('callbacked #2');
}, [1,2,3, 4,5,6]);

// var mq = GCD.mainQueue();
// var gq = GCD.globalQueue();


//
// Original
//

// Creating and Managing Queues
//
// dispatch_get_global_queue
// dispatch_get_main_queue
// dispatch_queue_create
// dispatch_get_current_queue
// dispatch_queue_get_label
// dispatch_set_target_queue
// dispatch_main

// Queuing Tasks for Dispatch
//
// dispatch_async
// dispatch_async_f
// dispatch_sync
// dispatch_sync_f
// dispatch_after
// dispatch_after_f
// dispatch_apply
// dispatch_apply_f
// dispatch_once

// Using Dispatch Groups
//
// dispatch_group_async
// dispatch_group_async_f
// dispatch_group_create
// dispatch_group_enter
// dispatch_group_leave
// dispatch_group_notify
// dispatch_group_notify_f
// dispatch_group_wait

// Managing Dispatch Objects
//
// dispatch_debug
// dispatch_get_context
// dispatch_release
// dispatch_resume
// dispatch_retain
// dispatch_set_context
// dispatch_set_finalizer_f
// dispatch_suspend

// Using Semaphores
//
// dispatch_semaphore_create
// dispatch_semaphore_signal
// dispatch_semaphore_wait

// Using Barriers
//
// dispatch_barrier_async
// dispatch_barrier_async_f
// dispatch_barrier_sync
// dispatch_barrier_sync_f

// Managing Dispatch Sources
//
// dispatch_source_cancel
// dispatch_source_create
// dispatch_source_get_data
// dispatch_source_get_handle
// dispatch_source_get_mask
// dispatch_source_merge_data
// dispatch_source_set_registration_handler
// dispatch_source_set_registration_handler_f
// dispatch_source_set_cancel_handler
// dispatch_source_set_cancel_handler_f
// dispatch_source_set_event_handler
// dispatch_source_set_event_handler_f
// dispatch_source_set_timer
// dispatch_source_testcancel

// Using the Dispatch I/O Convenience API
//
// dispatch_read
// dispatch_write

// Using the Dispatch I/O Channel API
//
// dispatch_io_create
// dispatch_io_create_with_path
// dispatch_io_read
// dispatch_io_write
// dispatch_io_close
// dispatch_io_set_high_water
// dispatch_io_set_low_water
// dispatch_io_set_interval

// Managing Dispatch Data Objects
//
// dispatch_data_create
// dispatch_data_get_size
// dispatch_data_create_map
// dispatch_data_create_concat
// dispatch_data_create_subrange
// dispatch_data_apply
// dispatch_data_copy_region

// Managing Time
//
// dispatch_time
// dispatch_walltime

// Managing Queue-Specific Context Data
//
// dispatch_queue_set_specific
// dispatch_queue_get_specific
// dispatch_get_specific