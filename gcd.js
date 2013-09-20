// gcd.js

// namespace
var GCD = {};

// Create a Web Worker instance to do the task in its own thread.
var AsyncWorker = function(id) {
	this.callbacks = {};
	this.asyncCount = 0;
	var self = this;

	var worker = new Worker('worker.js');
	worker.postMessage({'cmd': 'on_create', 'id': id});

	worker.onmessage = function(event) {
		var cb = self.callbacks[event.data.count];
		console.log('[' + id + ']' + ' result:' + event.data.result);
		if (cb)
			cb();
	};

	worker.onerror = function(error) {
		console.log('error in worker: [' + id + ':' + error.filename + ':' + error.lineno + '] ' + error.message);
	};
	this.worker = worker;
};

AsyncWorker.prototype.dispatch_async = function(func, callback, args) {
	this.asyncCount++;
	this.worker.postMessage({'cmd': 'dispatch_async', 'func': func.toString(), 'args': args, 'count': this.asyncCount});
	this.callbacks[this.asyncCount] = callback;
};

var worker_id = 1;

var SerialQueue = function() {
	this.worker = new AsyncWorker(worker_id++);
};

SerialQueue.prototype.dispatch_async = function(func, callback) {
	this.worker.dispatch_async(func, callback);
};


var ConcurrentQueue = function() {
	this.NUM_WORKERS = 4;

	this.workers = [];
	for (var i=0; i<this.NUM_WORKERS; i++)
		this.workers.push(new AsyncWorker(worker_id++));

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

// ----------------------------------------------------------------------------
// Tests
//
var q = new GCD.queue(true);

// do a simple math asynchronously
q.dispatch_async(function() {
	var b = 1 + 3;
	return b;
}, function() {
	console.log('callbacked #1');
});

// passing an array as argument
q.dispatch_async(function(arr) {
	return arr.length;
	// return 2 + 3;
}, function() {
	console.log('callbacked #2');
}, [1,2,3, 4,5,6]);

function benchMarkAsync() {
q.dispatch_async(function() {
	var _sunSpiderStartDate = new Date();

	/* The Great Computer Language Shootout
	   http://shootout.alioth.debian.org/
	   contributed by Isaac Gouy */

	function fannkuch(n) {
	   var check = 0;
	   var perm = Array(n);
	   var perm1 = Array(n);
	   var count = Array(n);
	   var maxPerm = Array(n);
	   var maxFlipsCount = 0;
	   var m = n - 1;

	   for (var i = 0; i < n; i++) perm1[i] = i;
	   var r = n;

	   while (true) {
	      // write-out the first 30 permutations
	      if (check < 30){
	         var s = "";
	         for(var i=0; i<n; i++) s += (perm1[i]+1).toString();
	         check++;
	      }

	      while (r != 1) { count[r - 1] = r; r--; }
	      if (!(perm1[0] == 0 || perm1[m] == m)) {
	         for (var i = 0; i < n; i++) perm[i] = perm1[i];

	         var flipsCount = 0;
	         var k;

	         while (!((k = perm[0]) == 0)) {
	            var k2 = (k + 1) >> 1;
	            for (var i = 0; i < k2; i++) {
	               var temp = perm[i]; perm[i] = perm[k - i]; perm[k - i] = temp;
	            }
	            flipsCount++;
	         }

	         if (flipsCount > maxFlipsCount) {
	            maxFlipsCount = flipsCount;
	            for (var i = 0; i < n; i++) maxPerm[i] = perm1[i];
	         }
	      }

	      while (true) {
	         if (r == n) return maxFlipsCount;
	         var perm0 = perm1[0];
	         var i = 0;
	         while (i < r) {
	            var j = i + 1;
	            perm1[i] = perm1[j];
	            i = j;
	         }
	         perm1[r] = perm0;

	         count[r] = count[r] - 1;
	         if (count[r] > 0) break;
	         r++;
	      }
	   }
	}

	var n = 11;
	var ret = fannkuch(n);

	var _sunSpiderInterval = new Date() - _sunSpiderStartDate;
	return _sunSpiderInterval;
}, function() {
	console.log('SunSpider');
});
}

for (var i=0; i<7; i++) {
	benchMarkAsync();
}

// ----------------------------------------------------------------------------
// Original API
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