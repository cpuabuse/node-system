/**
 * Extended error class for system loading errors.
 * @inner
 * @memberof module:system
 * @extends external:Error
 */
declare class LoaderError extends Error {
    /**
     * Creates an instance of LoaderError.
     * @param {string} [code=default_code] Error code
     * @param {string} [message=default_message] Error message
     */
    constructor(code: any, message: any);
}
