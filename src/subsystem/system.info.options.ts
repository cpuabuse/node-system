/*
	File: info.options.ts
	cpuabuse.com
*/

/**
 * Used for storing system options.
 */

import {
	Access,
	SubsystemExtensionArgs /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug
} from "../system/subsystem";
import Info from "./system.info";
import { LoaderError } from "../loaderError";
import { Options as SystemOptions } from "../system/system"; /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug

/** Variables of Options subsystem, received from initialization file. */
interface OptionsVars {
	homepage: string;
} /* eslint-disable-line no-extra-semi */ // ESLint inteface no-extra-semi bug

/** Variables of option subsystem, as stored. */
export interface OptionsInterface
	extends SystemOptions,
		OptionsVars {} /* eslint-disable-line no-extra-semi */ // ESLint inteface no-extra-semi bug

/**
 * Checks options argument for missing incorrect property types
 * @returns {boolean} Returns true if the arguments is corrupt; false if OK
 * **Usage**
 *
 * ```typescript
 * // Set options
 * let options: Options = {
 *   id: "stars",
 *   rootDir: "test",
 *   relativeInitDir: "stars",
 *   initFilename: "stars.yml",
 *   logging: "off"
 * };
 *
 * if (System.checkOptionsFailure(options)){
 *   throw new Error ("Options inconsistent.");
 * }
 * ```
 * @param {module:system~System~SystemArgs} options System options argument
 */
export function checkOptionsFailure(options: SystemOptions): boolean {
	let failed: boolean = false;

	if (options) {
		// Checks boolean
		if (!Object.prototype.hasOwnProperty.call(options, "logging")) {
			failed = true;
		} else if (typeof options.logging !== "string") {
			failed = true;
		} else if (!["off", "console", "file", "queue"].includes(options.logging)) {
			failed = true;
		}

		// Checks strings
		let stringOptions: (
			| "id"
			| "rootDir"
			| "relativeInitDir"
			| "initFilename")[] = [
			"id",
			"rootDir",
			"relativeInitDir",
			"initFilename"
		];
		stringOptions.forEach(function(
			element: "id" | "rootDir" | "relativeInitDir" | "initFilename"
		): void {
			if (!Object.prototype.hasOwnProperty.call(options, element)) {
				failed = true;
			} else if (typeof options[element] !== "string") {
				failed = true;
			}
		});
	} else {
		failed = true;
	}
	return failed;
}

/** Stores system options. */
export default class Options extends Info {
	constructor({
		args,
		system,
		publicEntrypoint,
		protectedEntrypoint,
		sharedEntrypoint,
		vars
	}: SubsystemExtensionArgs) {
		// Set options to be read
		if (args.system_args !== undefined) {
			// Assign system option args
			let { options }: { options: SystemOptions } = args.system_args;

			// Check options failure
			if (!checkOptionsFailure(options)) {
				let variables: OptionsInterface = {
					...options,
					...(vars as OptionsVars)
				};

				// Call superclass constructor
				super({
					args: new Object() as SubsystemExtensionArgs,
					protectedEntrypoint,
					publicEntrypoint,
					sharedEntrypoint,
					system,
					vars: variables
				});

				// Add method
				this.addMethods([
					{
						access: Access.public | Access.protected | Access.private,
						fn: checkOptionsFailure,
						name: "checkOptionsFailure"
					}
				]);

				// Terminate function execution
				return;
			}
		}

		// Report an error
		throw new LoaderError(
			"system_options_failure",
			"The options provided to the system constructor are inconsistent."
		);
	}
}
