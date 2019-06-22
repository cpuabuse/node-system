/*
	File: src/subsystem/behaviors.ts
	cpuabuse.com
*/

/**
 * Manages system behaviors.
 */

import { EventEmitter } from "events";
import { AtomicLock } from "../system/atomic";
import { behaviorAttachFail, behaviorAttachRequestFail, behaviorAttach, systemLoad } from "../system/event-list";
import { LoaderError } from "../loaderError";
import {
	Access,
	Subsystem /* eslint-disable-line no-unused-vars */, // ESLint bug
	SubsystemExtensionArgs as Args /* eslint-disable-line no-unused-vars */ // ESLint bug
} from "../system/subsystem";
import { System } from "../system/system"; /* eslint-disable-line no-unused-vars */ // ESLint bug
import { SystemError } from "../error";

/** Behavior creation error, returned by [[Behavior.addBehavior]]. */
export const behaviorCreationError: string = "behavior_creation_error";

/** Behavior index type for behaviorId and behaviorIndex class members. */
interface BehaviorIndex {
	[key: string]: Array<string>;
}

/**
 * System behavior - an object, with a property where key is the name of the behavior, and value is the function, taking a system context as an argument.
 *
 * **Behavior - argument outline**
 *
 * ```typescript
 *  amazing_behavior: function (that) {
 *   // Process system instance on "amazing_behavior"
 *   amazingProcessor(that);
 * }
 * ```
 */
export interface BehaviorInterface {
	[key: string]: BehaviorInterfaceCallback;
}

/** Callback to be used for a behavior. */
export interface BehaviorInterfaceCallback {
	(that: System): void;
}

/**
 * Adds a behavior to the behavior class instance.
 *
 * **Note**
 *
 * Does not check for inconsistencies within ID and index arrays, as if it is internally managed by this class, inconsistencies should not happen.
 *
 * **Usage**
 *
 * ```typescript
 * // Create a new instance of Behavior
 * var behavior = new Behavior();
 *
 * // Add a behavior
 * behavior.addBehavior("hello_behavior", () => console.log("Hello World"));
 * ```
 * @param name Name of the bahavior
 * @param callback Behavior callback function
 * @returns ID of the behavior; `behaviorCreationError` if creation failed
 */
async function addBehavior(this: Behavior, name: string, callback: BehaviorInterfaceCallback): Promise<string> {
	if (typeof name === "string") {
		// Name must be string
		if (typeof callback === "function") {
			// Callback must be a function
			if (this.nextBehaviorCounter < this.emitter.getMaxListeners()) {
				// Overflow protection
				// Lock
				await this.atomicLock.lock();

				// Increment next ID
				let id: string = (this.nextBehaviorCounter++).toString();

				// If no behavior with such name existed before, initialize an array for it
				if (!Object.prototype.hasOwnProperty.call(this.behaviorId, name)) {
					this.behaviorId[name] = new Array();
				}

				// Populate ID and index
				this.behaviorId[name].push(id);
				this.behaviorIndex[id] = new Array();
				this.behaviorIndex[id].push(name);

				// Add the behavior
				this.emitter.addListener(id, callback);

				// Release lock
				this.atomicLock.release();
				return id;
			}
		}
	}
	// Return if failed
	return behaviorCreationError;
}

/**
 * Adds behaviors to the system, and fires post-addtion events.
 * Firstly, this function attempts to add the behaviors.
 * When the behavior addition has been processed, the function will attempt to fire post-addition events, depending on success/failure of behavior additions.
 * @instance
 * @param behaviors Behaviors
 * // TODO: Events
 * @fires module:system.private#events#behaviorAttach
 * @fires module:system.private#events#behaviorAttachFail
 * @fires module:system.private#events#behaviorAttachRequestFail
 * **Usage**
 *
 * ```typescript
 * var options = {
 *   id: "lab_inventory",
 *   rootDir: "labs",
 *   relativeInitDir: "black_mesa",
 *   initFilename: "inventory.yml",
 *   logging: console
 * };
 * var behavior = {
 *   "check_inventory": () => {
 *     // Behavior functionality
 *     // ...
 *   }
 * }
 *
 * var labInventory = new System(options);
 * labInventory.addBehaviors([behavior]).then(function(){
 *   console.log("Behavior added.");
 * });
 * ```
 */
async function addBehaviors(this: Behavior, behaviors: Array<BehaviorInterface>): Promise<void> {
	if (Array.isArray(behaviors)) {
		// Sanity check - is an array
		if (behaviors.length > 0) {
			// Sanity check - is not empty
			// Loop - attachment
			await Promise.all(
				behaviors
					.map((element: BehaviorInterface): {
						behaviorAdded: Promise<string> | null;
						key: string;
					} | null => {
						if (typeof element === "object") {
							let properties: Array<string> = Object.getOwnPropertyNames(element);
							if (properties.length === 1) {
								let [key]: Array<string> = properties;
								let value: BehaviorInterfaceCallback = element[key];
								if (typeof key === "string") {
									if (key.length > 0 && typeof value === "function") {
										return {
											behaviorAdded: this.private.call.addBehavior(key, () => value(this.system)),
											key
										};
									}
									return {
										behaviorAdded: null,
										key
									};
								}
							}
						}
						return null;
					})
					.map(
						(element: { behaviorAdded: Promise<string> | null; key: string } | null): Promise<string | void> => {
							// Loop - post-attachment event fire
							if (element === null) {
								this.private.call.fire(behaviorAttachFail, "Behavior could not be added.");
								return Promise.resolve();
							}
							if (element.behaviorAdded) {
								this.private.call.fire(behaviorAttach, element.key);
								return element.behaviorAdded;
							}

							// Behavior not added
							this.private.call.fire(behaviorAttachRequestFail, "Event not described.");
							return Promise.resolve();
						}
					)
			);

			// Terminate if successfully processed arrays
			return;
		}
	}

	// Behaviors not an array || empty array
	this.private.call.fire(behaviorAttachRequestFail, "Incorrect request.");
} // <== addBehaviors

/**
 * Triggers behaviors registered for name.
 *
 * **Usage**
 *
 * ```typescript
 * // Create a new instance of Behavior
 * var behavior = new Behavior();
 *
 * // Add a behavior
 * behavior.addBehavior("hello_behavior", () => console.log("Hello World"));
 *
 * // Call a behavior
 * behavior.behave("hello_behavior");
 *
 * // Output:
 * // "Hello World"
 * ```
 * @param name Behavior name
 */
function behave(this: Behavior, name: string): void {
	if (typeof name === "string") {
		if (Object.prototype.hasOwnProperty.call(this.behaviorId, name)) {
			this.behaviorId[name].forEach((event: string): void => {
				this.emitter.emit(event);
			});
		}
	} else {
		// Fire here
	}
}

/**
 * Fires a system event
 * @param name - Event name, as specified in {@link module:system.private#events}.
 * @param message - Message is not strictly required, but preferred. If not specified, will assume value of the name
 * // TODO: @event module:system.private#events#eventFail
 * // TODO: **Throws** {external:Error} Will throw `error_hell`. The inability to process error - if {@link module:system.private#events#event:eventFail} event fails.
 *
 * **Usage**
 *
 * ```typescript
 * var options = {
 *   id: "lab_inventory",
 *   rootDir: "labs",
 *   relativeInitDir: "black_mesa",
 *   initFilename: "inventory.yml",
 *   logging: "console"
 * };
 *
 * var labInventory = new System(options);
 * labInventory.fire("system_load_aux", "Auxiliary system loaded.");
 * ```
 */
function fire(this: Behavior, name: string, message?: string): void {
	const eventSubsystem: string = "event";

	const eventAbsent: string = "event_absent";
	const errorHell: string = "error_hell";

	let msg: string;

	try {
		let event: { behavior?: boolean; error?: string; log?: string };

		// Verify event exists
		if (!Object.prototype.hasOwnProperty.call(this.system.public.subsystem[eventSubsystem].get.data, name)) {
			// throw new system error
			throw new SystemError(eventAbsent, "Could not fire an event that is not described.");
		}

		// Locate event
		event = this.system.public.subsystem[eventSubsystem].get.data[name];

		// Assign the message
		msg = message === undefined ? name : message;

		// Log
		if (event.log) {
			this.system.log(`${event.log} - ${msg}`);
		}

		// Error
		if (event.error) {
			this.system.error(`${name} - ${msg}`);
		}

		// Behavior
		if (event.behavior) {
			this.system.behave(name);
		}
		// Callback
	} catch (error) {
		let noFail: boolean = true;
		if (name === "event_fail") {
			noFail = false;
		}
		if (name === eventAbsent) {
			if (SystemError.isSystemError(error)) {
				if (error.code === eventAbsent) {
					noFail = false;
				}
			}
		}
		if (noFail) {
			this.private.call.fire("event_fail", "Event has failed");
		} else {
			throw errorHell;
		}
	}
} // <== fire

/** System behavior class. */
export default class Behavior extends Subsystem {
	/** Atomic lock to perform counter increments. */
	protected atomicLock: AtomicLock = new AtomicLock();

	/** IDs to use as actual event identifiers. */
	protected behaviorId: BehaviorIndex = new Object() as BehaviorIndex;

	/** Index to link id's back to behavior names. */
	protected behaviorIndex: BehaviorIndex = new Object() as BehaviorIndex;

	/** Contains the event data for the behaviors to fire. */
	protected emitter: EventEmitter = new EventEmitter();

	/** Counter to use to generate IDs. */
	protected nextBehaviorCounter: number = 0;

	/** Initializes system behavior. */
	// @ts-ignore tsc does not see inevitability of super()
	constructor({ system, args, protectedEntrypoint, publicEntrypoint, vars }: Args) {
		// Call superclass's constructor
		super({ protectedEntrypoint, publicEntrypoint, system });

		// Only if we received the args we continue
		if (args.system_args !== undefined) {
			// Add the methods
			this.addMethods([
				{
					access: Access.private | Access.protected,
					fn: addBehavior,
					name: "addBehavior"
				},
				{
					access: Access.private | Access.protected | Access.public,
					fn: addBehaviors,
					name: "addBehaviors"
				},
				{
					access: Access.private | Access.protected,
					fn: behave,
					name: "behave"
				},
				{
					access: Access.private | Access.protected | Access.public,
					fn: fire,
					name: "fire"
				}
			]);

			// Add the data
			if (Object.prototype.hasOwnProperty.call(vars, "data")) {
				this.addData([
					{
						access: Access.private | Access.protected | Access.public,
						name: "data",
						obj: vars.data
					}
				]);
			}
		} else {
			// Report an error
			throw new LoaderError(
				"system_options_failure",
				"The options provided to the system constructor are inconsistent."
			);
		}
	}
}
