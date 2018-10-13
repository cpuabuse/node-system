// atomic.js
/**
 * Virtual atomic operations
 */
"use strict";

/**
 * Specifies the time to wait between lock checks
 * @private
 * @inner
 * @memberof module:system~AtomicLock
 */
const waitTime = 400;

/**
 * Creates an instance of AtomicLock.
 * @inner
 * @memberof module:system
 */
class AtomicLock {
	constructor(){
		this.locked = false;
	}

	/**
	 * Lock an atomic lock
	 */
	lock(){
		(async () => {
			/* eslint no-constant-condition: "off" */
			while(true){
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