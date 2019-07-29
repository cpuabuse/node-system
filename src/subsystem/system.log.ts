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
	SubsystemEntrypoint /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug
} from "../system/subsystem";
import { LoaderError } from "../loaderError";

/**
 * Log an error  message from the System context
 * @fires module:system.private~type_error // TODO: Document fire
 * **Usage**
 *
 * ```typescript
 * // Text to print
 * let text = "Testing error log.";
 *
 * // From within the context of subsystem
 * args.shared.subsystem.log.call.error(text);
 *
 * // Error log output:
 * // Testing error log.
 * ```
 * @param text - Message
 */
function error(this: Log, text: string): void {
	if (this.subsystem[this.role.options].get.logging === "console") {
		/* eslint-disable-next-line no-console */
		console.error(
			`\x1b[31m[Error]\x1b[0m ${this.subsystem[this.role.options].get.id}: ${text}`
		);
	}
} // <== error

/**
 * Log message from the System context
 * @fires module:system.private~type_error // TODO: Document fire
 * **Usage**
 *
 * ```typescript
 * let text = "Lab Inventory working.";
 *
 * // From within the context of subsystem
 * args.shared.subsystem.log.call.log(text);
 *
 * // Log output:
 * // Lab Inventory working.
 * ```
 * @param text - Message
 */
function log(this: Log, text: string): void {
	if (this.subsystem[this.role.options].get.logging === "console") {
		/* eslint-disable-next-line no-console */
		console.log(
			`\x1b[32m[OK]\x1b[0m ${this.subsystem[this.role.options].get.id}: ${text}`
		);
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

	constructor({
		args,
		system,
		protectedEntrypoint,
		publicEntrypoint,
		sharedEntrypoint,
		vars
	}: Args) {
		/** Call super class constructor. */
		super({ protectedEntrypoint, publicEntrypoint, sharedEntrypoint, system });

		// Only if we received the args we continue
		if (args.shared !== undefined) {
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
