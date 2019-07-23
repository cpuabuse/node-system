/*
	File: test/unit/loader/constructor.ts
	cpuabuse.com
*/

/**
 * Tests the constructor for:
 *
 * - "unexpected_constructor" error
 * - Non-failure with dummy
 * - "Invalid intialization entry type" error
 */

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */

import { throws } from "assert";
import { sep } from "path";
import { Loader } from "../../../src/loader";
import { LoaderError } from "../../../src/loaderError";

/** Tests the constructor. */
export function test(): void {
	describe("constructor", function(): void {
		it("should produce unexpected_constructor error, with incoherent args", function(): void {
			throws(
				function(): void {
					/* eslint-disable-next-line no-new */ /* tslint:disable-next-line no-unused-expression */ // "new Loader" is only used for side-effects of testing
					new Loader("string", null, "string", null);
				},
				function(error: LoaderError | Error): boolean {
					return (
						error instanceof LoaderError &&
						error.code === "unexpected_constructor"
					);
				}
			);
		});
		it("should not fail as a dummy", function(): void {
			/* eslint-disable-next-line no-new */ /* tslint:disable-next-line no-unused-expression */ // "new Loader" is only used for side-effects of testing
			new Loader(null, null, null, null);
		});
		it('should produce "Invalid intialization entry type - average_height", when called with respective initialization file', function(): void {
			/* eslint-disable-next-line no-new */ /* tslint:disable-next-line no-unused-expression */ // "new Loader" is only used for side-effects of testing
			new Loader(`test${sep}data${sep}loader`, "trees", "init", function(
				load: Promise<void>
			): void {
				load.catch(function(err: LoaderError | Error): void {
					throws(
						function(): void {
							throw err;
						},
						function(error: LoaderError | Error): boolean {
							return (
								error instanceof Error &&
								error.message ===
									"Invalid intialization entry type - average_height"
							);
						}
					);
				});
			});
		});
	});
}
