/*	
	File: test.ts
	cpuabuse.com
*/

/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
 */

"use strict";

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */

const systemError = require("../src/error.js");
const loaderError = require("../src/loaderError.js");
const assert = require("assert");

/**
 * Tests for the Loader class.
 * @member LoaderError
 * @memberof module:system~test
 */
export function testLoaderError(){
	describe("LoaderError", function(){
		describe("constructor", function(){
			it("should initialize with default values", function(){
				let error = new loaderError.LoaderError();
				assert.strictEqual(error.code, "default_code");
				assert.strictEqual(error.message, "default_message");

				// Repeat with empty strings
				error = new loaderError.LoaderError("","");
				assert.strictEqual(error.code, "default_code");
				assert.strictEqual(error.message, "default_message");
			})
		})
	});
}
/**
 * Tests for the Loader class.
 * @member SystemError
 * @memberof module:system~test
 */
export function testSystemError(){
	describe("SystemError", function(){
		describe(".isSystemError()", function(){
			it("should return false for an empty error code", function(){
				let error = new systemError.SystemError("", "message");
				assert.strictEqual(systemError.SystemError.isSystemError(error), false);
			});
			it("should return false for non instance of SystemError", function(){
				assert.strictEqual(systemError.SystemError.isSystemError("Not an instance of SystemError"), false);
			});
		})
	});
}

module.exports = {
	testLoaderError,
	testSystemError
}