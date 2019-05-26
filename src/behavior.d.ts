/// <reference types="node" />
import { AtomicLock } from "./atomic";
import { EventEmitter } from "events";
export declare const behaviorCreationError: string;
declare type BehaviorIndex = {
    [key: string]: Array<string>;
};
/**
 * System behavior class
 * @inner
 * @memberof module:system
 * @extends external:EventEmitter
 */
export declare class Behavior extends EventEmitter {
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
    nextBehaviorCounter: number;
    /**
     * Initializes system behavior
     */
    constructor();
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
    addBehavior(name: string, callback: Function): Promise<string>;
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
    behave(name: string): void;
}
export {};
