// gcd.js

var GCD = {};

var Q = function() {
	this.q = new Array();
	var worker = new Worker('worker.js');
	var self = this;

	worker.onmessage = function(event) {
		var cb = self.callbacks[event.data.count];
		console.log('result:' + event.data.result);
		if (cb) {
			cb();
		}
	};

	worker.onerror = function(error) {
		console.log('error in worker: [' + error.filename + ':' + error.lineno + '] ' + error.message);
	};

	this.worker = worker;
	this.callbacks = {};
	this.asyncCount = 0;
};

Q.prototype.dispatch_sync = function(func) {
	return func();
};

Q.prototype.dispatch_async = function(func, callback) {
	this.asyncCount++;
	this.worker.postMessage({'cmd': 'dispatch_async', 'func': func.toString(), 'count': this.asyncCount});
	this.callbacks[this.asyncCount] = callback;
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
var q = new GCD.queue();
q.dispatch_sync(function() {
	var a = 1 + 2;
});

q.dispatch_async(function() {
	var b = 1 + 3;
	return b;
}, function() {
	console.log('callbacked');
});

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