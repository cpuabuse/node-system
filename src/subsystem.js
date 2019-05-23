// src/subsystem.ts
/*
    Used for constructing subsystems within system.
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Subsystem {
    constructor(systemContext, subsystemConstructor, subsystemContext) {
        // Set reference to system
        this.system = systemContext;
        // Set subsystem objects
        this.fn = new Object();
        this.vars = subsystemContext.hasOwnProperty("vars") ? subsystemContext.vars : new Object();
        this.methods = new Array();
        // Bind methods
        for (let bindFn of subsystemConstructor(this)) {
            // Bind fn to object; Using parent-child access not to create and overwrite an object wastefully
            this.methods[bindFn.name] = bindFn.fn.bind(subsystemContext);
        }
    }
}
exports.Subsystem = Subsystem;
