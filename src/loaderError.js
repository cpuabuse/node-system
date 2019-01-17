// loaderError.js
/*
	Provides errors to use during system loading.
*/
"use strict";

/**
 * Extended error class for system loading errors.
 * @inner
 * @memberof module:system
 * @extends external:Error
 */
class LoaderError extends Error{
	/**
	 * Creates an instance of LoaderError.
	 * @param {string} [code=default_code] Error code
	 * @param {string} [message=default_message] Error message
	 */
	constructor(code, message){
		let defaultCode = false;
		let defaultMessage = false;

		// Determine if to use a default code
		if(typeof code !== "string"){
			defaultCode = true;
		} else if(code.length === 0){
			defaultCode = true;
		}

		// Determine if to use a default message
		if(typeof message !== "string"){
			defaultMessage = true;
		} else if(code === 0){
			defaultMessage = true;
		}
		super(defaultMessage ? "default_message" : message);
		this.code = defaultCode ? "default_code" : code;
	}
}

exports.LoaderError = LoaderError;