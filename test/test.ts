// File: test/test.ts
/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
 */

import {testAtomicLock} from "./test-atomic";
import {testLoaderError, testSystemError} from "./test-errors";
import {testLoader} from "./test-loader";
import {testSystem} from "./test-system";

// DEBUG: Devonly - promise throw
process.on("unhandledRejection" as NodeJS.Signals, function(up: NodeJS.Signals): void{
	throw up;
});

// Run tests
testLoaderError();
testSystemError();
testLoader();
testSystem();
testAtomicLock();