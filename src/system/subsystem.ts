/*
	File: src/subsystem.ts
	cpuabuse.com
*/

/**
 * Used for constructing subsystems within system.
 */

import { AtomicLock } from "./atomic";
import { System } from "./system"; /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug

export interface ISubsystem extends Subsystem {
	new (args: ConstructorArgs): ISubsystem;
}

/** Interface for subsystem constructor data exchange. */
export interface ConstructorArgs {
	/** Context of a parent system. */
	systemContext: System;
	args: {
		system_args?: any;
	};
	/** Arbitrary arguments from a file. */
	vars: any;
} /* eslint-disable-line no-extra-semi */ // ESLint inteface no-extra-semi bug

/**
 * A way methods are transfered to a subsystem.
 * @typedef SubsystemMethod
 * @property {string} name Name of a function.
 * @property {Function} fn Function body, taking arbitrary arguments.
 */
export type SubsystemMethod = {
	name: string;
	fn: Function;
};
/**
 * @typedef Method
 */
type Method = {
	[key: string]: Function;
};

export class Subsystem extends AtomicLock {
	system: System;

	method: Method;

	data: any;

	constructor(systemContext: System, subsystemMethods: Array<SubsystemMethod> | null) {
		super();

		// Set reference to system
		this.system = systemContext;

		// Set subsystem objects
		this.method = <Method>new Object();
		if (subsystemMethods !== null) {
			// Bind methods
			for (let bindFn of subsystemMethods) {
				// Bind fn to object; Using parent-child access not to create and overwrite an object wastefully
				this.method[bindFn.name] = bindFn.fn.bind(this);
			}
		}

		// Create a dummy data property
		this.data = null;
	}

	/**
	 * Returns a copy of specified variable.
	 * @param name Name of the property
	 */
	public get(name: string): any {
		// Lock
		this.lock();

		// Defualt return value
		let result: any; // Undefined

		// Return copied object if target is object, else return the primitive itself
		if (Object.keys(this.data).includes(name)) {
			result = typeof this.data[name] === "object" ? Object.assign(new Object(), this.data[name]) : this.data[name];
		}

		// Unlock
		this.release();

		// Return result
		return result;
	}
}
