/*
	File: src/system/subsystem.ts
	cpuabuse.com
*/

/**
 * Used for constructing subsystems within system.
 */

import { AtomicLock } from "./atomic";
import { BehaviorInterface } from "../behavior"; /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug
import { System, Options, SubsystemEntrypoint } from "./system"; /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug

export interface ISubsystem extends Subsystem {
	new (args: SubsystemExtensionArgs): ISubsystem;
}

/** Interface for arguments of extended classes. */
export interface SubsystemExtensionArgs {
	/** Arguments from system or extending class. */
	args: {
		[key: string]: any;

		system_args?: {
			behaviors: Array<{ [key: string]: BehaviorInterface }>;
			options: Options;
		};
	};

	/** Protected entrypoint for subsystem. */
	protectedEntrypoint: SubsystemEntrypoint;

	/** Public entrypoint for subsystem. */
	publicEntrypoint: SubsystemEntrypoint;

	/** Context of a parent system. */
	systemContext: System;

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

	constructor(systemContext: System, subsystemMethods?: Array<SubsystemMethod> | null) {
		super();

		// Set reference to system
		this.system = systemContext;

		// Set subsystem objects
		this.method = <Method>new Object();
		if (subsystemMethods !== undefined && subsystemMethods !== null) {
			this.addMethods(subsystemMethods);
		}

		// Create a dummy data property
		this.data = null;
	}

	protected addMethods(methods: Array<SubsystemMethod>) {
		// Bind methods
		for (let bindFn of methods) {
			// Bind fn to object; Using parent-child access not to create and overwrite an object wastefully
			this.method[bindFn.name] = bindFn.fn.bind(this);
		}
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
