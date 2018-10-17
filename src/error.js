// error.js
/*
	Provides errors for the system.
*/
"use strict";

/**
 * Extended system error class.
 * @inner
 * @memberof module:system
 * @extends external:error
 */
class SystemError extends Error{
	/**
	 * Creates an instance of SystemError.
	 * @param {string} code Error code
	 * @param {string} message Error message
	 * @throws {external:Error} Throwing error if the code already defined
	 */
	constructor(code, message){
		super(message);
		/**
		 * Error code.
		 * @private
		 * @type {string}
		 */
		this.code = code;
	}

	/**
	 * Check if an object is indeed a functional SystemError.
	 *
	 * Note:
	 *
	 * - Not checking for presence of code property, or for it being a string, as assuming that the object of SystemError type would have it initialized.
	 * - Empty code errors will return false, due to the ambiguity.
	 * @param {module:system.SystemError} error Error to check
	 * @returns {boolean} Returns `true` if is is a SystemError, `false` if not.
	 */
	static isSystemError(error){
		if((error instanceof SystemError)){
			if (error.code != ""){
				return true;
			}
		}
		return false;
	}
}

exports.SystemError = SystemError;