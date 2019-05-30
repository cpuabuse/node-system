// src/loaderError.js
/**
 * Provides errors to use during system loading.
 */

/** Extended error class for system loading errors. */
export class LoaderError extends Error{
	/** Error code */
	code:string;

	/**
	 * Creates an instance of LoaderError.
	 * @param code Error code
	 * @param message Error message
	 */
	constructor(code: string, message: string){
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
		} else if(message.length === 0){
			defaultMessage = true;
		}
		super(defaultMessage ? "default_message" : message);
		this.code = defaultCode ? "default_code" : code;
	}
}