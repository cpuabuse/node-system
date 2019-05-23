declare const events: any;
declare const atomic: any;
/**
 * System behavior class
 * @inner
 * @memberof module:system
 * @extends external:EventEmitter
 */
declare class Behavior extends events.EventEmitter {
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
     * @return {number} ID of the behavior; `-1` if creation failed
     * @example <caption>Usage</caption>
     * // Create a new instance of Behavior
     * var behavior = new Behavior();
     *
     * // Add a behavior
     * behavior.addBehavior("hello_behavior", () => console.log("Hello World"));
     */
    addBehavior(name: any, callback: any): Promise<number>;
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
    behave(name: any): void;
}
