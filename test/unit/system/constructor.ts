/*
	File: test/unit/system/constructor.ts
	cpuabuse.com
*/

/**
 * Tests constructor for the following.
 *
 * - Should still execute with inappropriate options and no ways to report an error
 * - Should execute with inappropriate options and error reporting not being a function
 * - Should fail with inappropriate options
 * - Should fail with no events or behaviors files
 * - Should report functionality_error with fake options
 */

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */
/* global before:true */

import { strictEqual, throws } from "assert";
import { sep } from "path";
import {
	ErrorCallback /* eslint-disable-line no-unused-vars */,
	Options /* eslint-disable-line no-unused-vars */,
	System
} from "../../../src/system/system";
import { LoaderError } from "../../../src/loaderError";

/** Test for SystemError. */
interface ErrorTest {
	description: string;
	error: string;
}

describe("constructor", function(): void {
	it("should still execute with inappropriate options and no ways to report an error", function(): void {
		/* eslint-disable-next-line no-new */ /* tslint:disable-next-line no-unused-expression */ // "new System" is only used for side-effects of testing
		new System({} as {
			behaviors: Array<{
				[key: string]: {
					(that: System): void;
				};
			}> | null;
			onError: ErrorCallback | null;
			options: Options;
		});
	});
	it("should execute with inappropriate options and error reporting not being a function", function(): void {
		/* eslint-disable-next-line no-new */ /* tslint:disable-next-line no-unused-expression */ // "new System" is only used for side-effects of testing
		new System({
			behaviors: null,
			onError: ("notFunction" as unknown) as ErrorCallback,
			options: (null as unknown) as Options
		} as {
			behaviors: Array<{
				[key: string]: {
					(that: System): void;
				};
			}> | null;
			onError: ErrorCallback | null;
			options: Options;
		});
	});
	it("should fail with inappropriate options", function(done: () => void): void {
		/* eslint-disable-next-line no-new */ /* tslint:disable-next-line no-unused-expression */ // "new System" is only used for side-effects of testing
		new System({
			behaviors: null,
			onError(error: any): void {
				strictEqual(error.code, "system_options_failure");
				strictEqual(error.message, "The options provided to the system constructor are inconsistent.");
				done();
			},
			options: (null as unknown) as Options
		});
	});
	it("should fail with no events or behaviors files", function(done: any): void {
		/* eslint-disable-next-line no-new */ /* tslint:disable-next-line no-unused-expression */ // "new System" is only used for side-effects of testing
		new System({
			behaviors: null,
			onError(err: any): void {
				throws(
					function(): void {
						throw err;
					},
					function(error: any): boolean {
						return error instanceof LoaderError && error.code === "functionality_error";
					}
				);
				done();
			},
			options: {
				id: "cities",
				initFilename: "init",
				logging: "off",
				relativeInitDir: "cities",
				rootDir: `test${sep}data${sep}system`
			}
		});
	});
	it("should report functionality_error with fake options", function(done: any): void {
		/* eslint-disable-next-line no-new */ /* tslint:disable-next-line no-unused-expression */ // "new System" is only used for side-effects of testing
		new System({
			behaviors: null,
			onError(err: any): void {
				throws(
					function(): void {
						throw err;
					},
					function(error: any): boolean {
						return err instanceof LoaderError && error.code === "functionality_error";
					}
				);
				done();
			},
			options: {
				id: "fakeID",
				initFilename: "fakeInit",
				logging: "off",
				relativeInitDir: "fakeDir",
				rootDir: "fakeRoot"
			}
		});
	});
	/**
	 * Post-instance initialization error tests.
	 *
	 * - Should not generate inappropriately defined errors
	 * - Should generate the default message
	 * TODO : Define DONE and its function
	 */
	describe("errorInitialization", function(): void {
		let systemErrors: Array<ErrorTest> = [
			{
				description: "no error message",
				error: "no_message"
			},
			{
				description: "empty message",
				error: "empty_message"
			},
			{
				description: "message not a string",
				error: "message_not_a_string"
			}
		];
		let systemTest: any;
		before(function(done: () => void): void {
			systemTest = new System({
				behaviors: [
					{
						system_load(): void {
							done();
						}
					}
				],
				onError(): void {
					done();
				},
				options: {
					id: "errorInitializationCheck",
					initFilename: "init",
					logging: "off",
					relativeInitDir: "error_initialization_check",
					rootDir: `test${sep}data${sep}system`
				}
			});
		});
		it("should not generate inappropriately defined errors", function(): void {
			strictEqual(Object.prototype.hasOwnProperty.call(systemTest.private.error, "not_object"), false);
		});
		for (let error of systemErrors) {
			it("should generate the default message with " + error.description, function() {
				strictEqual(systemTest.private.error[error.error].message, "Error message not set.");
			});
		}
	});
});
