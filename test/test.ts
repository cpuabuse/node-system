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
import { unit } from "./unit/unit";
import { integration } from "./integration/integration";

// DEBUG: Devonly - promise throw
process.on("unhandledRejection" as NodeJS.Signals, function(
	up: NodeJS.Signals
): void {
	throw up;
});

// Call unit test
unit();

// Call integration test
integration();

// Run tests
testLoaderError();
testSystemError();
testLoader();
testAtomicLock();
