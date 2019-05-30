/**
 * Atomic operations.
 */
/**
 * Creates an instance of AtomicLock.
 * Single thread only, queue present.
 */
export declare class AtomicLock {
    /** Counter for current instance in queue. */
    private count;
    /** Indicates the locked/unlocked state. */
    private locked;
    /** Counter for current amount of instances in a queue. */
    private maxCount;
    /**
     * Lock an atomic lock.
     *
     * **Usage**
     *
     * ```typescript
     * // Lock
     * exampleAtomicLock.lock();
     * ```
     * @returns Resolves when lock succeeds
     */
    lock(): Promise<void>;
    /**
     * Release atomic lock
     *
     * **Usage**
     *
     * // Release
     * exampleAtomicLock.release();
     */
    release(): void;
}
