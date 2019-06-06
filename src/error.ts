/*	
	File: src/error.ts
	cpuabuse.com
*/

/** 
 * Provides errors for the system.
 */

/** Extended system error class. */
export class SystemError extends Error{
	/** Error code. */
	code:string;

	/**
	 * Creates an instance of SystemError.
	 * @param code Error code
	 * @param message Error message
	 * @throws [[Error]] Throwing error if the code already defined
	 */
	constructor(code:string, message:string){
		super(message);
		this.code = code;
	}

	/**
	 * Check if an object is indeed a functional SystemError.
	 *
	 * **Note**
	 *
	 * - Not checking for presence of code property, or for it being a string, as assuming that the object of SystemError type would have it initialized.
	 * - Empty code errors will return false, due to the ambiguity.
	 *
	 * **Usage**
	 *
	 * ```typescript
	 * // Try to load JSON
	 * try{
	 *   loadJson();
	 * } catch(error) {
	 *   if (SystemError.isSystemError(error)){
	 *     // If error is something that we have defined, throw a more generic error
	 *     throw new SystemError("json_load_fail", "Failed to load JSON file.");
	 *   } else {
	 *     // Rethrow the original error
	 *     throw error;
	 *   }
	 * }
	 * ```
	 * @param error Error to check
	 * @returns Returns `true` if is is a SystemError, `false` if not.
	 */
	static isSystemError(error:SystemError){
		if((error instanceof SystemError)){
			if (error.code != ""){
				return true;
			}
		}
		return false;
	}
}