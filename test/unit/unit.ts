/*
	File: test/unit/unit.ts
	cpuabuse.com
*/

/** Series of unit tests. */

// Set eslint to ingore describe and it for assert
/* global describe:true */

import { test as testSystem } from "./system/system";

/** Execute unit tests. */
export function unit(): void {
	describe("unit", function(): void {
		testSystem();
	});
}
