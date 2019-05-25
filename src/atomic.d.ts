/**
 * Creates an instance of AtomicLock.
 *
 * Single thread only.
 * @memberof module:system
 */
export declare class AtomicLock {
    locked: boolean;
    maxCount: number;
    count: number;
    /**
     * Creates an instance of AtomicLock.
     * Does not take any arguments or return any values.
     */
    constructor();
    /**
     * Lock an atomic lock.
     * @returns {external:Promise} Resolves when lock succeeds
     * @example <caption>Usage</caption>
     * // Lock
     * exampleAtomicLock.lock();
     */
    lock(): Promise<void>;
    /**
     * Release atomic lock
     * @example <caption>Usage</caption>
     * // Release
     * exampleAtomicLock.release();
     */
    release(): void;
}
