/*
	File: info.ts
	cpuabuse.com
*/

/**
 * Subsystem info.
 */

import { SubsystemExtensionArgs, Subsystem } from "../system/subsystem"; /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug

export default class Info extends Subsystem {
	constructor({ system, vars, protectedEntrypoint, publicEntrypoint }: SubsystemExtensionArgs) {
		// Call superclass constructor
		super({ protectedEntrypoint, publicEntrypoint, system });

		// Assign data
		this.data = vars;
	}
}
