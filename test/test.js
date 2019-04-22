// test.js
/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
*/
"use strict";

/**
 * Series of tests for the system.
 * @inner
 * @member test
 * @memberof module:system
 */

// DEBUG: Devonly - promise throw
process.on("unhandledRejection", up => {
	throw up
});

require("./test-errors.js").testLoaderError();
require("./test-errors.js").testSystemError();
require("./test-loader.js").testLoader();
require("./test-system.js").testSystem();
require("./test-atomic.js").testAtomicLock();