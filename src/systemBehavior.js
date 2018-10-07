// systemBehaviors.js
"use strict";

const events = require("events");
const systemAtomic = require("./systemAtomic.js");

/**
 * System behavior class
 * @inner
 * @memberof module:system
 * @extends external:EventEmitter
 */
class SystemBehavior extends events.EventEmitter{
	/** Initializes system behavior */
	constructor(){
		super();

		/**
		 * Atomic lock to perform counter increments
		 * @private
		 */
		this.atomicLock = new systemAtomic.AtomicLock();

		/**
		 * ID to use as actual event identifier
		 * @private
		 */
		this.behaviorId = {};

		/**
		 * Index to link id's back to behavior names
		 * @private
		 */
		this.behaviorIndex = new Array();

		/**
		 * Counter to use to generate IDs
		 * @private
		 */
		this.nextBehaviorCounter = 0;
	}

	/**
	 * Adds a behavior to the behavior class instance.
	 * Does not check for inconsistencies within ID and index arrays, as if it is internally managed by this class, inconsistencies should not happen.
	 * @param {string} name Name of the bahavior
	 * @param {function} callback Behavior callback function
	 * @return {number} ID of the behavior; -1 if creation failed
	 */
	addBehavior(name, callback){
		if(typeof name === "string"){
			if(typeof callback === "function"){
				if(this.nextBehaviorCounter < this.getMaxListeners()){
					this.atomicLock.lock();
					let id = this.nextBehaviorCounter++;
					if(!this.behaviorId.hasOwnProperty(name)){
						this.behaviorId[name] = new Array();
					}
					this.behaviorId[name].push(id.toString());
					this.behaviorIndex.push(name);
					this.addListener(id.toString(), callback);
					this.atomicLock.release();
					return id;
				}
			}
		}
		return -1;
	}

	/**
	 * Triggers behaviors registered for name
	 * @param {string} name Behavior name
	 */
	behave(name){
		if(typeof name === "string"){
			console.log(this.behaviorId);
			this.behaviorId[name].forEach(event => {
				this.emit(event);
			});
		}
	}
}

exports.SystemBehavior = SystemBehavior;