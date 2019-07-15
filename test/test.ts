/*
	File: test/test.ts
	cpuabuse.com
*/

/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
 */

import { testAtomicLock } from "./test-atomic";
import { testLoaderError, testSystemError } from "./test-errors";
import { testLoader } from "./test-loader";
import { testSystem } from "./system/system";
import { unit } from "./unit/unit";

// DEBUG: Devonly - promise throw
process.on("unhandledRejection" as NodeJS.Signals, function(
	up: NodeJS.Signals
): void {
	throw up;
});

// Call unit test
unit();

// Run tests
testLoaderError();
testSystemError();
testLoader();
testSystem();
testAtomicLock();
