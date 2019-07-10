/*
	File: src/subsystem/system.event.ts
	cpuabuse.com
*/

/**
 * Contains instructions for behaviours.
 */

import { Access, SubsystemData as Data, Subsystem, SubsystemExtensionArgs as Args } from "../system/subsystem";

/** This class handles events. */
export default class Event extends Subsystem {
	/** Constructs an instance of events. */
	constructor({ system, protectedEntrypoint, publicEntrypoint, sharedEntrypoint, vars }: Args) {
		super({ protectedEntrypoint, publicEntrypoint, sharedEntrypoint, system });

		// TODO: Add checks for consistency of the events

		// Prepare the date
		let data: Array<Data> = [
			{
				access: Access.private | Access.protected | Access.public,
				name: "data",
				obj: vars.data
			}
		];

		// Add data
		this.addData(data);
	}
}
