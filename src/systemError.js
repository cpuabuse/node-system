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
 * @param {string} code Error code
 * @param {string} message Error message
 * @throws {external:Error} Throwing error if the code already defined
 */
class SystemError extends Error{
	constructor(code, message){
		super(message);
		this.code = code;
	}

	/**
	 * Check if an object is indeed a functional SystemError
	 * @param {module:system.SystemError} error Error to check
	 */
	static isSystemError(error){
		if((error instanceof SystemError)){
			if(error.hasOwnProperty("code")){
				if (error.code != ""){
					return true;
				}
			}
		}
		return false;
	}
}

exports.SystemError = SystemError;