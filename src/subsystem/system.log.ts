/*
	File: src/subsystem/system.log.ts
	cpuabuse.com
*/

/**
 * Log subsystem.
 */

import {
	Access,
	Subsystem,
	SubsystemExtensionArgs as Args /* eslint-disable-line no-unused-vars */, // ESLint bug
	SubsystemEntrypoint
} from "../system/subsystem";
import { LoaderError } from "../loaderError";

/**
 * Log an error  message from the System context
 * @instance
 * @param {string} text - Message
 * @fires module:system.private~type_error
 * @example <caption>Usage</caption>
 * var options = {
 *   id: "lab_inventory",
 *   rootDir: "labs",
 *   relativeInitDir: "black_mesa",
 *   initFilename: "inventory.yml",
 *   logging: console
 * };
 * var text = "Testing Lab Inventory error log.";
 *
 * var labInventory = new System(options);
 * labInventory.error(text);
 */
function error(this: Log, text: string): void {
	if (this.subsystem[this.role.options].get.logging === "console") {
		/* eslint-disable-next-line no-console */
		console.error(`\x1b[31m[Error]\x1b[0m ${this.subsystem[this.role.options].get.id}: ${text}`);
	}
} // <== error

/**
 * Log message from the System context
 * @instance
 * @param {string} text - Message
 * @fires module:system.private~type_error
 * @example <caption>Usage</caption>
 * var options = {
 *   id: "lab_inventory",
 *   rootDir: "labs",
 *   relativeInitDir: "black_mesa",
 *   initFilename: "inventory.yml",
 *   loggomg: console
 * };
 * var text = "Lab Inventory working.";
 *
 * var labInventory = new System(options);
 * labInventory.log(text);
 */
function log(this: Log, text: string): void {
	if (this.subsystem[this.role.options].get.logging === "console") {
		/* eslint-disable-next-line no-console */
		console.log(`\x1b[32m[OK]\x1b[0m ${this.subsystem[this.role.options].get.id}: ${text}`);
	}
} // <== log

/** Class for logging. */
export default class Log extends Subsystem {
	/** Role */
	protected role: {
		/** Subsystem. */
		[key: string]: string;
	};

	/** Contains the shared subsystem entrypoint. */
	protected subsystem: {
		[key: string]: SubsystemEntrypoint;
	};

	constructor({ args, system, protectedEntrypoint, publicEntrypoint, sharedEntrypoint, vars }: Args) {
		/** Call super class constructor. */
		super({ protectedEntrypoint, publicEntrypoint, sharedEntrypoint, system });

		// Only if we received the args we continue
		if (args.shared !== undefined) {
			// Assigning shared to instance
			this.role = args.shared.role;

			// Assign shared subsystems
			this.subsystem = args.shared.subsystem;

			// Add the homepage
			if (Object.prototype.hasOwnProperty.call(vars, "homepage")) {
				this.addData([
					{
						access: Access.private | Access.protected | Access.public,
						name: "homepage",
						obj: vars.homepage
					}
				]);
			}

			// Add methods
			this.addMethods([
				{
					access: Access.private | Access.protected | Access.shared,
					fn: log,
					name: "log"
				},
				{
					access: Access.private | Access.protected | Access.shared,
					fn: error,
					name: "error"
				}
			]);
		} else {
			// Report an error
			throw new LoaderError(
				"system_options_failure",
				"The options provided to the system constructor are inconsistent."
			);
		}
	}
}
