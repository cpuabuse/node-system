// test/test-atomic.ts
/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
*/

/**
 * Series of tests for the system.
 * @inner
 * @member test
 * @memberof module:system
 */

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */

const system = require("../src/system.js");
const assert = require("assert");
const waitTime = 200;

/**
 * Tests of AtomicLock class.
 * @member AtomicLock
 * @memberof module:system~test
 */
export function testAtomicLock(){
	describe("AtomicLock", function() {
		// Assing variables
		let atomicLock = new system.AtomicLock();

		describe("initial state", function(){
			it("should be unlocked", function(){
				assert.strictEqual(atomicLock.locked, false);
			});
		});

		describe("locked state", function(){
			it("should be locked", function(done){
				atomicLock.lock().then(function(){
					assert.strictEqual(atomicLock.locked, true);
					done();
				});
			});
		});

		describe("lock while locked", function(){
			it("should lock after timed release", function(done){
				setTimeout(function(){
					atomicLock.release();
				}, waitTime);
				atomicLock.lock().then(() => done());
				assert.strictEqual(atomicLock.locked, true);
			})
		})
	});
}

module.exports = {
	testAtomicLock
}