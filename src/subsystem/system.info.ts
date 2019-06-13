/*
	File: info.ts
	cpuabuse.com
*/

/**
 * Subsystem info.
 */

import { SubsystemExtensionArgs, Subsystem } from "../system/subsystem"; /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug

export default class Info extends Subsystem {
	constructor({ systemContext, vars }: SubsystemExtensionArgs) {
		// Call superclass constructor
		super(systemContext, null);

		// Assign data
		this.data = vars;
	}
}
