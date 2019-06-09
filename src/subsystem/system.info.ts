/*
	File: info.ts
	cpuabuse.com
*/

/**
 * Subsystem info.
 */

import { ConstructorArgs, Subsystem } from "../system/subsystem"; /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug

export default class Info extends Subsystem {
	constructor(args: ConstructorArgs) {
		// Call superclass constructor
		super(args.systemContext, null);

		// Assign data
		this.data = args.vars;
	}
}
