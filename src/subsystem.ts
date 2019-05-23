// src/subsystem.ts
/*
	Used for constructing subsystems within system.
*/
"use strict";
import {System} from "./system";

export class Subsystem{
	system:System;
	fn:object;
	vars:object;
	methods:Array<object>;
	constructor(systemContext:System, subsystemConstructor:Function, subsystemContext:object){
		// Set reference to system
		this.system = systemContext;

		// Set subsystem objects
		this.fn = new Object();
		this.vars = subsystemContext.hasOwnProperty("vars") ? subsystemContext.vars : new Object();
		this.methods = new Array();

		// Bind methods
		for(let bindFn of subsystemConstructor(this)){
			// Bind fn to object; Using parent-child access not to create and overwrite an object wastefully
			this.methods[bindFn.name] = bindFn.fn.bind(subsystemContext);
		}
	}
}