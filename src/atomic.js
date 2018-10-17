// atomic.js
/*
	Atomic operations.
*/
"use strict";

/**
 * Specifies the time to wait between lock checks.
 * @private
 * @readonly
 * @default
 * @type {string}
 * @memberof module:system~AtomicLock
 */
const waitTime = 10;

/**
 * Creates an instance of AtomicLock.
 * It is not intended to be actually used for parallel processing, and mutual exlusion. It is intended for abstraction of atomic logic more than anything.
 * @memberof module:system
 */
class AtomicLock {
	/**
	 * Creates an instance of AtomicLock.
	 * Does not take any arguments or return any values.
	 */
	constructor(){
		/**
		 * Indicates the locked/unlocked state.
		 * @private
		 * @type {boolean}
		 */
		this.locked = false;
	}

	/**
	 * Lock an atomic lock.
	 * @returns {external:Promise} Resolves when lock succeeds
	 */
	lock(){
		return (async () => {
			while(true){ /* eslint-disable-line no-constant-condition */// <== Necessary to achieve the exclusive functionality
				if(this.locked){
					let timeout = new Promise(function(resolve){
						setTimeout(function(){
							resolve();
						}, waitTime);
					});
					await timeout;
				} else {
					this.locked = true;
					return;
				}
			}
		})();
	}

	/**
	 * Release atomic lock
	 */
	release(){
		this.locked = false;
	}
}

exports.AtomicLock = AtomicLock;