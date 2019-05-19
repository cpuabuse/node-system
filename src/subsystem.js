// subsystem.js
/*
	Used for constructing subsystems within system.
*/
"use strict";

class Subsystem{
	constructor(systemContext, subsystemConstructor, subsystemContext){
		// Set reference to system
		this.system = systemContext;

		// Set subsystem objects
		this.fn = new Object();
		this.vars = subsystemContext.hasOwnProperty("vars") ? subsystemContext.vars : new Object();

		// Bind methods
		for(let bindFn of subsystemConstructor(this)){
			// Bind fn to object; Using parent-child access not to create and overwrite an object wastefully
			this.methods[bindFn.name] = bindFn.fn.bind(subsystemContext);
		}
	}
}

module.exports = {
	Subsystem
};