/*
	File: info.ts
	cpuabuse.com
*/

/**
 * Subsystem info.
 */

import {
	Access /* eslint-disable-line no-unused-vars */, // ESLint type import detection bug
	SubsystemData as Data /* eslint-disable-line no-unused-vars */, // ESLint type import detection bug
	SubsystemExtensionArgs /* eslint-disable-line no-unused-vars */, // ESLint type import detection bug
	Subsystem
} from "../system/subsystem";

/** Generic subsystem for information. */
export default class Info extends Subsystem {
	constructor({ system, vars, protectedEntrypoint, publicEntrypoint }: SubsystemExtensionArgs) {
		// Call superclass constructor
		super({ protectedEntrypoint, publicEntrypoint, system });

		// Declare data array
		let data: Array<Data> = new Array() as Array<Data>;

		Object.keys(vars).forEach(function(name: string): void {
			data.push({ access: Access.private | Access.protected, name, obj: vars[name] });
		});

		// Assign data
		this.addData(data);
	}
}
