/*
	File: src/system/subsystem.ts
	cpuabuse.com
*/

/**
 * Used for constructing subsystems within system.
 */

import { AtomicLock } from "./atomic";
import { Behaviors } from "../subsystem/system.behavior"; /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug
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

/** Interface to represent data held by subsystem. */
interface Data {
	[key: string]: any;
}

export interface ISubsystem extends Subsystem {
	new (args: SubsystemExtensionArgs): ISubsystem;
}

/** Methods of an initialized subsystem. */
interface Method {
	[key: string]: (...args: Array<any>) => any;
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

/** Defines how data is added to the subsystem. */
export interface SubsystemData {
	/** What access the data should have.  */
	access: Access;

	/** Name of the data. */
	name: string;

	/** The data iteself. */
	obj: any;
}

/** Interface for arguments of extended classes. */
export interface SubsystemExtensionArgs {
	/** Arguments from system or extending class. */
	args: {
		[key: string]: any;
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

/** Entrypoint for the subsystem. */
export class SubsystemEntrypoint {
	/* */
	/** Methods. */
	public call: Method = new Object() as Method;

	/** Data. */
	public get: Data = new Object() as Data;
}

/** Base subsystem class. All subsystems extend it. */
export class Subsystem extends SubsystemEntrypoint {
	/** Private functions. */
	public call: Method = new Object() as Method;

	/** Reference to private entrypoint. */
	public private: SubsystemEntrypoint = this;

	/** Reference to protected entrypoint. */
	public protected: SubsystemEntrypoint;

	/** Reference to public entrypoint. */
	public public: SubsystemEntrypoint;

	/** Parent system. */
	protected system: System;

	/** Private data */
	private data: any = new Object();

	/** Atomic lock for atomic subsystem operations. */
	private lock: AtomicLock = new AtomicLock();

	/** Private methods */
	private method: Method = new Object() as Method;

	/** Constructs subsystem. */
	constructor({ system, protectedEntrypoint, publicEntrypoint }: SubsystemArgs) {
		// Call superclass constructor
		super();

		// Set reference to system
		this.system = system;

		// Initialize public entrypoint
		this.public = publicEntrypoint;

		// Initialize protected entrypoint
		this.protected = protectedEntrypoint;
	}

	/** Adds subsystem data to the subsystem. */
	protected addData(data: Array<SubsystemData>): void {
		data.forEach((subsystemData: SubsystemData): void => {
			let addSubsystemData: (access: "public" | "protected" | "private") => void = (
				access: "public" | "protected" | "private"
			): void => {
				if ((subsystemData.access & Access[access]) === Access[access]) {
					Object.defineProperty(this[access].get, subsystemData.name, {
						get: (): void => {
							return typeof this.data[subsystemData.name] === "object"
								? Object.assign(new Object(), this.data[subsystemData.name])
								: this.data[subsystemData.name];
						}
					});
				}
			};

			// Assign to data
			this.data[subsystemData.name] = subsystemData.obj;

			// Assign entrypoints
			addSubsystemData("public");
			addSubsystemData("protected");
			addSubsystemData("private");
		});
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
