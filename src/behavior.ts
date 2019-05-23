// src/behaviors.ts
/*
	Manages system behaviors.
*/
"use strict";

const events = require("events");
const atomic = require("./atomic.js");

/**
 * System behavior class
 * @inner
 * @memberof module:system
 * @extends external:EventEmitter
 */
class Behavior extends events.EventEmitter{
	/**
	 * Initializes system behavior
	 */
	constructor(){
		// Call superclass's constructor
		super();

		/**
		 * Atomic lock to perform counter increments
		 * @private
		 * @type {module:system.AtomicLock}
		 */
		this.atomicLock = new atomic.AtomicLock();

		/**
		 * IDs to use as actual event identifiers
		 * @private
		 * @type {Object}
		 */
		this.behaviorId = new Object();

		/**
		 * Index to link id's back to behavior names
		 * @private
		 * @type {string[]}
		 */
		this.behaviorIndex = new Array();

		/**
		 * Counter to use to generate IDs
		 * @private
		 * @type {number}
		 */
		this.nextBehaviorCounter = 0;
	}

	/**
	 * Adds a behavior to the behavior class instance.
	 *
	 * Note:
	 *
	 * Does not check for inconsistencies within ID and index arrays, as if it is internally managed by this class, inconsistencies should not happen.
	 * @param {string} name Name of the bahavior
	 * @param {function} callback Behavior callback function
	 * @return {number} ID of the behavior; `-1` if creation failed
	 * @example <caption>Usage</caption>
	 * // Create a new instance of Behavior
	 * var behavior = new Behavior();
	 *
	 * // Add a behavior
	 * behavior.addBehavior("hello_behavior", () => console.log("Hello World"));
	 */
	async addBehavior(name, callback){
		if(typeof name === "string"){ // Name must be string
			if(typeof callback === "function"){ // Callback must be a function
				if(this.nextBehaviorCounter < this.getMaxListeners()){ // Overflow protection
					// Lock
					await this.atomicLock.lock();

					// Increment next ID
					let id = this.nextBehaviorCounter++;

					// If no behavior with such name existed before, initialize an array for it
					if(!this.behaviorId.hasOwnProperty(name)){
						this.behaviorId[name] = new Array();
					}

					// Populate ID and index
					this.behaviorId[name].push(id.toString());
					this.behaviorIndex.push(name);

					// Add the behavior
					this.addListener(id.toString(), callback);

					// Release lock
					this.atomicLock.release();
					return id;
				}
			}
		}
		// Return if failed
		return -1;
	}

	/**
	 * Triggers behaviors registered for name
	 * @param {string} name Behavior name
	 * @example <caption>Usage</caption>
	 * // Create a new instance of Behavior
	 * var behavior = new Behavior();
	 *
	 * // Add a behavior
	 * behavior.addBehavior("hello_behavior", () => console.log("Hello World"));
	 *
	 * // Call a behavior
	 * behavior.behave("hello_behavior");
	 *
	 * // Output:
	 * // "Hello World"
	 */
	behave(name){
		if(typeof name === "string"){
			if(this.behaviorId.hasOwnProperty(name)){
				this.behaviorId[name].forEach(event => {
					this.emit(event);
				});
			}
		} else {
			// Fire here
		}
	}
}

exports.Behavior = Behavior;