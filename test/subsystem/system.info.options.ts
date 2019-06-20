/*
	test/subsystem/system.info.options.ts
*/

/**
 * Tests system.info.options subsystem.
 */

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */

import { strictEqual } from "assert";
import { System } from "../../src/system/system"; /* eslint-disable-line no-unused-vars */ // ESLint bug
import { SystemTest } from "../system/system"; /* eslint-disable-line no-unused-vars */ // ESLint bug

/** Tests `system.info.options` subsystem. */
export default function test(system: System, systemTest: SystemTest): void {
	describe('."system.info.options"', function(): void {
		// System instance ID
		describe("id", function(): void {
			it(`should be ${systemTest.options.id}`, function(done: () => void): void {
				strictEqual(system.public.subsystem.options.get.id, systemTest.options.id);
				done();
			});
		});
	});
}
