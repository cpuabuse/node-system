/*
	File: test/unit/loader/join.ts
	cpuabuse.com
*/

/**
 * Tests the join function with:
 *
 * - Single argument
 * - Array as argument
 */

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */

import { deepStrictEqual } from "assert";
import { sep } from "path";
import { Loader } from "../../../src/loader";

/** Tests the join fucntion. */
export function test(): void {
	describe('.join("mozart", "sonatas")', function(): void {
		let expectedPath: string = `mozart${sep}sonatas`;
		it(`should be equal to ${expectedPath}`, function(): void {
			deepStrictEqual(Loader.join("mozart", "sonatas"), expectedPath);
		});
		it("should work with array", function(): void {
			deepStrictEqual(Loader.join("mozart", ["sonatas", "sonatas"]), [
				expectedPath,
				expectedPath
			]);
		});
	});
}
