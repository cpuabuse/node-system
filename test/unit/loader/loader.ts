/*
	File: test/unit/loader/loader.ts
	cpuabuse.com
*/

/** Unit test for a loader. */

// Set eslint to ingore describe and it for assert
/* global describe:true */

import { test as testLoaderError } from "./error";
import { test as testConstructor } from "./constructor";
import { test as testYamlToObject } from "./yamlToObject";
import { test as testJoin } from "./join";

/** Call loader unit test. */
export function test(): void {
	describe("System", function(): void {
		testLoaderError();
		testConstructor();
		testYamlToObject();
		testJoin();
	});
}
