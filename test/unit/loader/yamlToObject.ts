/*
	File: test/test.ts
	cpuabuse.com
*/

/** Tests that function produces appropriate object from YAML string. */

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */

import { deepStrictEqual } from "assert";
import { Loader } from "../../../src/loader";

/** Tests yaml to object function. */
export function test(): void {
	describe(".yamlToObject()", function(): void {
		let data: string = "Wine: Red";
		let expectedResults: { Wine: string } = {
			Wine: "Red"
		};
		it("should produce JSON", function(): void {
			deepStrictEqual(Loader.yamlToObject(data), expectedResults);
		});
	});
}
