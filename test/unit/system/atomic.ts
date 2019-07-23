/*
	File: test/test-atomic.ts
	cpuabuse.com
*/

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

import { strictEqual } from "assert";
import { AtomicLock } from "../../../src/system/system";

/** Time to wait. */
const waitTime: number = 200;

/** Tests of AtomicLock class. */
export function test(): void {
	describe("AtomicLock", function(): void {
		// Assing variables
		let atomicLock: AtomicLock = new AtomicLock();

		describe("initial state", function(): void {
			it("should be unlocked", function(): void {
				strictEqual(atomicLock.isLocked, false);
			});
		});

		describe("locked state", function(): void {
			it("should be locked", function(done: () => void): void {
				atomicLock.lock().then(function(): void {
					strictEqual(atomicLock.isLocked, true);
					done();
				});
			});
		});

		describe("lock while locked", function(): void {
			it("should lock after timed release", function(done: () => void): void {
				setTimeout(function(): void {
					atomicLock.release();
				}, waitTime);
				atomicLock.lock().then(() => done());
				strictEqual(atomicLock.isLocked, true);
			});
		});
	});
}
