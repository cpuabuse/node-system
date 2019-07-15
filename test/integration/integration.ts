/*
	File: test/integration/integration.ts
	cpuabuse.com
*/

/** Series of integration tests. */

// Set eslint to ingore describe and it for assert
/* global describe:true */

import { test as testSystem } from "./system/system";

/** Execute integration tests. */
export function integration(): void {
	describe("integration", function(): void {
		testSystem();
	});
}
