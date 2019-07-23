/*
	File: test.ts
	cpuabuse.com
*/

/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
 */

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */

import { strictEqual } from "assert";
import { SystemError } from "../../../src/error";

/** Tests for the Loader class. */
export function test(): void {
	describe("SystemError", function(): void {
		describe(".isSystemError()", function(): void {
			it("should return false for an empty error code", function(): void {
				let error: SystemError = new SystemError("", "message");
				strictEqual(SystemError.isSystemError(error), false);
			});
			it("should return false for non instance of SystemError", function(): void {
				strictEqual(
					SystemError.isSystemError(
						("Not an instance of SystemError" as unknown) as SystemError
					),
					false
				);
			});
		});
	});
}
