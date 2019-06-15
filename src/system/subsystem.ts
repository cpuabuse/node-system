/*
	File: src/system/subsystem.ts
	cpuabuse.com
*/

/**
 * Used for constructing subsystems within system.
 */

import { AtomicLock } from "./atomic";
import { BehaviorInterface } from "../behavior"; /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug
import { System, Options } from "./system"; /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug

/** Method access flags. */
export enum Access /* eslint-disable-line no-unused-vars */ { // ESLint detection bug
	/** Public flag. */
	public = 1 << 1 /* eslint-disable-line no-unused-vars */, // ESLint detection bug

	/** Protected flag. */
	protected = 1 << 2 /* eslint-disable-line no-unused-vars */, // ESLint detection bug

	/** Private flag. */
	private = 1 << 3 /* eslint-disable-line no-unused-vars */ // ESLint detection bug
}

export interface ISubsystem extends Subsystem {
	new (args: SubsystemExtensionArgs): ISubsystem;
}

/** Subsystem class arguments. */
export interface SubsystemArgs {
	/** Protected entrypoint reference. */
	protectedEntrypoint: SubsystemEntrypoint;

	/** Public entrypoint reference. */
	publicEntrypoint: SubsystemEntrypoint;

	/** System context. */
	system: System;
}

/** Entrypoint for the subsystem. */
export interface SubsystemEntrypoint {
	call: {
		[key: string]: (...args: Array<any>) => any;
	};
	get: {
		(property: string): any;
	};
}

/** Interface for arguments of extended classes. */
export interface SubsystemExtensionArgs {
	/** Arguments from system or extending class. */
	args: {
		[key: string]: any;

		protectedEntrypoint: SubsystemEntrypoint;

		publicEntrypoint: SubsystemEntrypoint;

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
	system: System;

	/** Arbitrary arguments from a file. */
	vars: any;
}

/** A way methods are transfered to a subsystem. */
export interface SubsystemMethod {
	/** Access flags. */
	access: Access;

	/** Function body, taking arbitrary arguments. */
	fn: (...args: any) => any;

	/** Name of a function. */
	name: string;
}

/** Methods of an initialized subsystem. */
interface Method {
	[key: string]: (...args: any) => any;
}

/** Base subsystem class. All subsystems extend it. */
export class Subsystem extends AtomicLock implements SubsystemEntrypoint {
	/** Private functions. */
	public call: Method = new Object() as Method;

	/** Private data */
	protected data: any = new Object();

	/** Private methods */
	private method: Method = new Object() as Method;

	/** Reference to private entrypoint. */
	private private: SubsystemEntrypoint = this;

	/** Reference to protected entrypoint. */
	private protected: SubsystemEntrypoint;

	/** Reference to public entrypoint. */
	private public: SubsystemEntrypoint;

	/** Parent system. */
	private system: System;

	/** Constructs subsystem. */
	constructor({ system, protectedEntrypoint, publicEntrypoint }: SubsystemArgs) {
		super();
		// Set reference to system
		this.system = system;

		// Initialize public entrypoint
		this.public = publicEntrypoint;

		// Initialize protected entrypoint
		this.protected = protectedEntrypoint;
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

	/** Add methods to the subsystem. */
	protected addMethods(methods: Array<SubsystemMethod>): void {
		// Bind methods
		methods.forEach((method: SubsystemMethod): void => {
			let addMethod: (access: "public" | "protected" | "private") => void = (
				access: "public" | "protected" | "private"
			): void => {
				if ((method.access & Access[access]) === Access[access]) {
					this[access].call[method.name] = this.method[method.name];
				}
			};

			// Assign the method
			this.method[method.name] = method.fn.bind(this);

			// Assign public entrypoint
			addMethod("public");

			// Assign protected entrypoint
			addMethod("protected");

			// Assign public entrypoint
			addMethod("private");
		});
	}
}
