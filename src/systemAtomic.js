// systemAtomic.js
/**
 * Virtual atomic operations
 */
"use strict";

/**
 * Creates an instance of AtomicLock.
 * @inner
 * @memberof module:system
 */
class AtomicLock {
    constructor() {
        this.locked = false;
    }

    /**
	 * Lock an atomic lock
	 */
    lock(){
        this.locked = true;
    }

	/**
	 * Release atomic lock
	 */
    release(){
        this.locked = false;
    }
}

exports.AtomicLock = AtomicLock;