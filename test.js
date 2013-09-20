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

// Run them in parallel
for (var i=0; i<7; i++) {
	benchMarkAsync();
}