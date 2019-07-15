/*
	File: error.ts
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
import { LoaderError } from "../../../src/loaderError";

/**
 * Tests for the Loader class.
 * @member LoaderError
 * @memberof module:system~test
 */
export function test(): void {
	describe("LoaderError", function(): void {
		describe("constructor", function(): void {
			it("should initialize with default values", function(): void {
				let error: LoaderError = new LoaderError();
				strictEqual(error.code, "default_code");
				strictEqual(error.message, "default_message");

				// Repeat with empty strings
				error = new LoaderError("", "");
				strictEqual(error.code, "default_code");
				strictEqual(error.message, "default_message");
			});
		});
	});
}
