/*
	File: src/subsystem/behaviors.ts
	cpuabuse.com
*/

/**
 * Manages system behaviors.
 */

import { EventEmitter } from "events";
import { AtomicLock } from "../system/atomic";
import {
	Subsystem /* eslint-disable-line no-unused-vars */, // ESLint bug
	SubsystemExtensionArgs as Args /* eslint-disable-line no-unused-vars */ // ESLint bug
} from "../system/subsystem";
import { System } from "../system/system"; /* eslint-disable-line no-unused-vars */ // ESLint bug

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
 *  amazing_behavior: (that) => {
 *   // Process system instance on "amazing_behavior"
 *   amazingProcessor(that);
 * }
 * ```
 */
export interface BehaviorInterface {
	(that: System): void;
}

/** System behavior class. */
export class Behavior extends Subsystem {
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
	constructor({ systemContext, args, vars }: Args) {
		// Call superclass's constructor
		super(systemContext);

		this.addMethods([
			{
				fn: addBehavior,
				name: "addBehavior"
			}
		]);
	}
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
async function addBehavior(this: Behavior, name: string, callback: Function): Promise<string> {
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
				if (!this.behaviorId.hasOwnProperty(name)) {
					this.behaviorId[name] = new Array();
				}

				// Populate ID and index
				this.behaviorId[name].push(id);
				this.behaviorIndex[id] = new Array();
				this.behaviorIndex[id].push(name);

				// Add the behavior
				this.emitter.addListener(id, <(...args: any[]) => void>callback);

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
		if (this.behaviorId.hasOwnProperty(name)) {
			this.behaviorId[name].forEach(event => {
				this.emitter.emit(event);
			});
		}
	} else {
		// Fire here
	}
}
