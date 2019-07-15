/*
	File: test/unit/system/checkOptionsFailure.ts
	cpuabuse.com
*/

/** Test the checkOptionsFailure function. */

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */

import * as assert from "assert";
import {
	checkOptionsFailure,
	Options /* eslint-disable-line no-unused-vars */
} from "../../../src/system/system";

/** Test check options failure. */
export function test(): void {
	describe(".checkOptionsFailure()", function(): void {
		let optionsArray: Array<any> = [
			{
				errorDescription: '"logging" not set',
				options: {
					id: "chickenCoup",
					initFilename: "init",
					loggingNameError: false,
					relativeInitDir: "chicken_coup",
					rootDir: "test"
				}
			},
			{
				errorDescription: '"logging" not a string',
				options: {
					id: "chickenCoup",
					initFilename: "init",
					logging: false,
					relativeInitDir: "chicken_coup",
					rootDir: "test"
				}
			},
			{
				errorDescription: '"logging" not a permitted string',
				options: {
					id: "chickenCoup",
					initFilename: "init",
					logging: "not_included_string",
					relativeInitDir: "chicken_coup",
					rootDir: "test"
				}
			},
			{
				errorDescription: '"id" not set',
				options: {
					idNameError: "chickenCoup",
					initFilename: "init",
					logging: "off",
					relativeInitDir: "chicken_coup",
					rootDir: "test"
				}
			},
			{
				errorDescription: '"id" not string',
				options: {
					id: 123456789,
					initFilename: "init",
					logging: "off",
					relativeInitDir: "chicken_coup",
					rootDir: "test"
				}
			}
		];
		optionsArray.forEach(function(options: any): void {
			it(`should fail with " + ${options.errorDescription}`, function(): void {
				assert.strictEqual(
					checkOptionsFailure(options.options as Options),
					true
				);
			});
		});
	});
}
