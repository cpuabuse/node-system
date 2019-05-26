// src/subsystem.ts
/*
	Used for constructing subsystems within system.
*/
import {System} from "./system"; /* eslint-disable-line no-unused-vars */// ESLint type import detection bug
/**
 * Interface for subsystem constructor data exchange.
 * @typedef ConstructorArgs
 * @property {module:system.System} systemContext Context of a parent system.
 * @property {Object} args Arbitrary arguments.
 */
export interface ConstructorArgs{
	systemContext:System;
	args:any;
};/* eslint-disable-line no-extra-semi */// ESLint inteface no-extra-semi bug

/**
 * A way methods are transfered to a subsystem.
 * @typedef SubsystemMethod
 * @property {string} name Name of a function.
 * @property {Function} fn Function body, taking arbitrary arguments.
*/
export type SubsystemMethod = {
	name:string;
	fn:Function;
};
/**
 * @typedef Method
 */
type Method = {
	[key:string]:Function
};

export class Subsystem{
	system:System;
	method:Method;
	data:any;

	constructor(systemContext:System, subsystemMethods:Array<SubsystemMethod>|null){
		// Set reference to system
		this.system = systemContext;

		// Set subsystem objects
		this.method = <Method>new Object();
		if(subsystemMethods !== null){
			// Bind methods
			for(let bindFn of subsystemMethods){
				// Bind fn to object; Using parent-child access not to create and overwrite an object wastefully
				this.method[bindFn.name] = bindFn.fn.bind(this);
			}
		}

		// Create a dummy data property
		this.data = null;
	}
}