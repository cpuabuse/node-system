/*
	File: test/unit/system/system.ts
	cpuabuse.com
*/

/** Unit test for a system. */

// Set eslint to ingore describe and it for assert
/* global describe:true */

import { test as testAtomic } from "./atomic";
import { test as testConstructor } from "./constructor";
import { test as testCheckOptionsFailure } from "./checkOptionsFailure";
import { test as testSystemError } from "./error";

/** Call system unit test. */
export function test(): void {
	describe("System", function(): void {
		testAtomic();
		testConstructor();
		testCheckOptionsFailure();
		testSystemError();
	});
}
