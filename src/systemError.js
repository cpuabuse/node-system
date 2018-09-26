// systemError.js
/**
 * Provides errors for the system
 */
"use strict";

/**
 * Extended system error class.
 * Creates an instance of SystemError.
 * @inner
 * @memberof module:system
 * @extends external:error
 * @param {module:system.System} systemContext System context
 * @param {string} code Error code
 * @param {string} message Error message
 * @throws {external:Error} Throwing error if the code already defined
 */
class SystemError extends Error{
	constructor(systemContext, code, message){
		let errorNotSet = true; // Flag if fail to get error

		if(systemContext.errors.hasOwnProperty(code)){ // Check that error exists as an event
			if (systemContext.errors[code].hasOwnProperty("error")){ // Check that event can do errors
				if(typeof systemContext.errors[code].error === "string"){
					super(message);
					this.code = code;
					errorNotSet = false;
				}
			}
		}

		if(errorNotSet){
			throw new Error("System error undefined.");
		}
	}
}

exports.SystemError = SystemError;