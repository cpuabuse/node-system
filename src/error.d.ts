/**
 * Extended system error class.
 * @inner
 * @memberof module:system
 * @extends external:Error
 */
export declare class SystemError extends Error {
    code: string;
    /**
     * Creates an instance of SystemError.
     * @param {string} code Error code
     * @param {string} message Error message
     * @throws {external:Error} Throwing error if the code already defined
     */
    constructor(code: string, message: string);
    /**
     * Check if an object is indeed a functional SystemError.
     *
     * Note:
     *
     * - Not checking for presence of code property, or for it being a string, as assuming that the object of SystemError type would have it initialized.
     * - Empty code errors will return false, due to the ambiguity.
     * @param {module:system.SystemError} error Error to check
     * @returns {boolean} Returns `true` if is is a SystemError, `false` if not.
     * @example <caption>Usage</caption>
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
     */
    static isSystemError(error: SystemError): boolean;
}
