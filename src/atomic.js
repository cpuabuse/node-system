// src/atomic.ts
/*
    Atomic operations.
*/
"use strict";
/**
 * Creates an instance of AtomicLock.
 *
 * Single thread only.
 * @memberof module:system
 */
class AtomicLock {
    /**
     * Creates an instance of AtomicLock.
     * Does not take any arguments or return any values.
     */
    constructor() {
        /**
         * Indicates the locked/unlocked state.
         * @private
         * @type {boolean}
         */
        this.locked = false;
        this.maxCount = 0;
        this.count = 0;
    }
    /**
     * Lock an atomic lock.
     * @returns {external:Promise} Resolves when lock succeeds
     * @example <caption>Usage</caption>
     * // Lock
     * exampleAtomicLock.lock();
     */
    lock() {
        /**
         * Function to increment the counters in an unnecessary safe manner
         */
        function increment(counter) {
            return counter === Number.MAX_SAFE_INTEGER ? 0 : counter + 1;
        }
        // Assign current queue counter
        var count = this.maxCount;
        // Increment max counter
        this.maxCount = increment(this.maxCount);
        return (async () => {
            while (true) { /* eslint-disable-line no-constant-condition */ // <== Necessary to achieve the exclusive functionality
                if (this.locked) {
                    let timeout = new Promise(function (resolve) {
                        setImmediate(function () {
                            resolve();
                        });
                    });
                    await timeout;
                }
                else if (count === this.count) {
                    // Lock
                    this.locked = true;
                    // Increment next unlock counter
                    this.count = increment(this.count);
                    return;
                }
            }
        })();
    }
    /**
     * Release atomic lock
     * @example <caption>Usage</caption>
     * // Release
     * exampleAtomicLock.release();
     */
    release() {
        this.locked = false;
    }
}
exports.AtomicLock = AtomicLock;
