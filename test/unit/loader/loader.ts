/*
	File: test/unit/loader/loader.ts
	cpuabuse.com
*/

/** Unit test for a loader. */

// Set eslint to ingore describe and it for assert
/* global describe:true */

import { test as testLoaderError } from "./error";

/** Call loader unit test. */
export function test(): void {
	describe("System", function(): void {
		testLoaderError();
	});
}
