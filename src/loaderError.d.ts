/**
 * Provides errors to use during system loading.
 */
/** Extended error class for system loading errors. */
export declare class LoaderError extends Error {
    /** Error code */
    code: string;
    /**
     * Creates an instance of LoaderError.
     * @param code Error code
     * @param message Error message
     */
    constructor(code: string, message: string);
}
