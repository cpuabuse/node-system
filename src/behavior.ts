// src/behaviors.ts
/*
	Manages system behaviors.
*/
import {AtomicLock} from "./atomic";
import {EventEmitter} from "events";
export const behaviorCreationError:string = "behavior_creation_error";

/* Behavior index type for behaviorId and behaviorIndex class members. Choosing not to document, as it seems unnecessary. */
type BehaviorIndex = {
	[key: string]: Array<string>;
};

/**
 * System behavior class
 * @inner
 * @memberof module:system
 * @extends external:EventEmitter
 */
export class Behavior extends EventEmitter{
	/**
	 * Atomic lock to perform counter increments
	 * @private
	 * @type {module:system.AtomicLock}
	 */
	atomicLock: AtomicLock;

	/**
	 * IDs to use as actual event identifiers
	 * @private
	 * @type {Object}
	 */
	behaviorId: BehaviorIndex;

	// behaviorId = { name:new array}

	/**
	 * Index to link id's back to behavior names
	 * @private
	 * @type {string[]}
	 */
	behaviorIndex: BehaviorIndex;

	/**
	 * Counter to use to generate IDs
	 * @private
	 * @type {number}
	 */
	nextBehaviorCounter: number = 0;

	/**
	 * Initializes system behavior
	 */
	constructor(){
		// Call superclass's constructor
		super();

		// Instantiate class variables
		this.atomicLock = new AtomicLock();
		this.behaviorId = <BehaviorIndex>new Object();
		this.behaviorIndex = <BehaviorIndex>new Object();
	}

	/**
	 * Adds a behavior to the behavior class instance.
	 *
	 * Note:
	 *
	 * Does not check for inconsistencies within ID and index arrays, as if it is internally managed by this class, inconsistencies should not happen.
	 * @param {string} name Name of the bahavior
	 * @param {function} callback Behavior callback function
	 * @return {string} ID of the behavior; `behaviorCreationError` if creation failed
	 * @example <caption>Usage</caption>
	 * // Create a new instance of Behavior
	 * var behavior = new Behavior();
	 *
	 * // Add a behavior
	 * behavior.addBehavior("hello_behavior", () => console.log("Hello World"));
	 */
	async addBehavior(name: string, callback: Function): Promise<string>{
		if(typeof name === "string"){ // Name must be string
			if(typeof callback === "function"){ // Callback must be a function
				if(this.nextBehaviorCounter < this.getMaxListeners()){ // Overflow protection
					// Lock
					await this.atomicLock.lock();

					// Increment next ID
					let id: string = (this.nextBehaviorCounter++).toString();

					// If no behavior with such name existed before, initialize an array for it
					if(!this.behaviorId.hasOwnProperty(name)){
						this.behaviorId[name] = new Array();
					}

					// Populate ID and index
					this.behaviorId[name].push(id);
					this.behaviorIndex[id] = new Array();
					this.behaviorIndex[id].push(name);

					// Add the behavior
					this.addListener(id, <(...args: any[]) => void>callback);

					// Release lock
					this.atomicLock.release();
					return id;
				}
			}
		}
		// Return if failed
		return behaviorCreationError;
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
	behave(name: string): void{
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