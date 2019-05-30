/// <reference types="node" />
/**
 * Manages system behaviors.
 */
import { AtomicLock } from "./atomic";
import { EventEmitter } from "events";
import { System } from "./system";
/** Behavior creation error, returned by [[Behavior.addBehavior]]. */
export declare const behaviorCreationError: string;
/**
 * System behavior - an object, with a property where key is the name of the behavior, and value is the function, taking a system context as an argument.
 *
 * **Behavior - argument outline**
 *
 * ```typescript
 *  amazing_behavior: (that) => {
 *   // Process system instance on "amazing_behavior"
 *   amazingProcessor(that);
 * }
 * ```
 */
export interface BehaviorInterface {
    (that: System): void;
}
/** Behavior index type for behaviorId and behaviorIndex class members. */
declare type BehaviorIndex = {
    [key: string]: Array<string>;
};
/** System behavior class. */
export declare class Behavior extends EventEmitter {
    /** Atomic lock to perform counter increments. */
    atomicLock: AtomicLock;
    /** IDs to use as actual event identifiers. */
    behaviorId: BehaviorIndex;
    /** Index to link id's back to behavior names. */
    behaviorIndex: BehaviorIndex;
    /** Counter to use to generate IDs. */
    nextBehaviorCounter: number;
    /** Initializes system behavior. */
    constructor();
    /**
     * Adds a behavior to the behavior class instance.
     *
     * **Note**
     *
     * Does not check for inconsistencies within ID and index arrays, as if it is internally managed by this class, inconsistencies should not happen.
     *
     * **Usage**
     *
     * ```typescript
     * // Create a new instance of Behavior
     * var behavior = new Behavior();
     *
     * // Add a behavior
     * behavior.addBehavior("hello_behavior", () => console.log("Hello World"));
     * ```
     * @param name Name of the bahavior
     * @param callback Behavior callback function
     * @returns ID of the behavior; `behaviorCreationError` if creation failed
     */
    addBehavior(name: string, callback: Function): Promise<string>;
    /**
     * Triggers behaviors registered for name.
     *
     * **Usage**
     *
     * ```typescript
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
     * ```
     * @param name Behavior name
     */
    behave(name: string): void;
}
export {};
