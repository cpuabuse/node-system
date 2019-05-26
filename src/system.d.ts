/**
 * System is intended more than anything, for centralized managment.
 * @module system
 */
import { AtomicLock } from "./atomic";
import { Loader } from "./loader";
export { AtomicLock };
/**
 * Provides wide range of functionality for file loading and event exchange.
 * Throws standard error if failed to perform basic initializations, or system failure that cannot be reported otherwise has occured.
 * @memberof module:system
 * @extends module:system~Loader
 * @throws {external:Error}
 *
 * - `loader_failed` - Loader did not construct the mandatory properties
 * @fires module:system.System#events#systemLoad
 */
export declare class System extends Loader {
    /**
     * System options
     * @typedef {Object} module:system.System~options
     * @property {string} id - System instace internal ID.
   * @property {string} rootDir - The root directory for the System instance.
   * @property {string} relativeInitDir - The relative directory to root of the location of the initialization file.
   * @property {string} initFilename - Initialization file filename.
     * @property {string} logging - The way system logs
     */
    /**
     * System options
     * @typedef {Object} module:system.System~filterContext
     * @property {string} dir Parent directory of the filtered item
     * @property {string} itemName Name of the filtered item
     * @property {string} item Path to the filtered item
     */
    /**
     * System behavior - an object, with a property where key is the name of the behavior, and value is the function, taking a system context as an argument.
     * @typedef {Object} module:system.System~behavior
     * @property {function}
     * @example <caption>Behavior - argument outline</caption>
   * amazing_behavior: (that) => {
   *   // Process system instance on "amazing_behavior"
   *   amazingProcessor(that);
   * }
     */
    /**
     * The constructor will perform necessary preparations, so that failures can be processed with system events. Up until these preparations are complete, the failure will result in thrown standard Error.
     * @param {module:system.System~options} options System options.
     * @param {module:system.System~behavior[]} [behaviors] - [Optional] Behaviors to add.
     * @param {Function} [onError] - [Optional] Callback for error handling during delayed execution after loader has loaded. Takes error string as an argument.
     */
    constructor(options: any, behaviors: any, onError: any);
    /**
     * Checks options argument for missing incorrect property types
     * @param {module:system~System~options} options System options argument
     * @returns {boolean} Returns true if the arguments is corrupt; false if OK
     * @example <caption>Usage</caption>
     * var options = {
     *   id: "stars",
     *   rootDir: "test",
     *   relativeInitDir: "stars",
     *   initFilename: "stars.yml",
     *   logging: "off"
     * };
     *
     * if (System.checkOptionsFailure(options)){
     *   throw new Error ("Options inconsistent.");
     * }
     */
    static checkOptionsFailure(options: any): boolean;
    /**
     * Adds an error to the System dynamically
     * @instance
     * @param {string} code Error code
     * @param {string} message Error description
     * @fires module:system.System#events#errorExists
     * @example <caption>Usage</caption>
     * code = "no_beakers"
     * message = "Beakers out of stock."
     * var options = {
     *   id: "lab_inventory",
     *   rootDir: "labs",
     *   relativeInitDir: "black_mesa",
     *   initFilename: "inventory.yml",
     *   logging: "console"
     * };
     * var labInventory = new System(options);
     *
     * labInventory.addError(code, message);
     */
    addError(code: any, message: any): void;
    /**
     * Adds behaviors to the system, and fires post-addtion events.
     * Firstly, this function attempts to add the behaviors.
     * When the behavior addition has been processed, the function will attempt to fire post-addition events, depending on success/failure of behavior additions.
     * @instance
     * @param {module:system.System~behavior[]} behaviors
     * @fires module:system.System#events#behaviorAttach
     * @fires module:system.System#events#behaviorAttachFail
     * @fires module:system.System#events#behaviorAttachRequestFail
* @example <caption>Usage</caption>
     * var options = {
     *   id: "lab_inventory",
     *   rootDir: "labs",
     *   relativeInitDir: "black_mesa",
     *   initFilename: "inventory.yml",
     *   logging: console
     * };
     * var behavior = {
     *   "check_inventory": () => {
     *     // Behavior functionality
     *     // ...
     *   }
     * }
     *
     * var labInventory = new System(options);
     * labInventory.addBehaviors([behavior]).then(function(){
     *   console.log("Behavior added.");
     * });
     */
    addBehaviors(behaviors: any): Promise<void>;
    /**
     * Log message from the System context
     * @instance
     * @param {string} text - Message
     * @fires module:system.System~type_error
     * @example <caption>Usage</caption>
     * var options = {
     *   id: "lab_inventory",
     *   rootDir: "labs",
     *   relativeInitDir: "black_mesa",
     *   initFilename: "inventory.yml",
     *   loggomg: console
     * };
     * var text = "Lab Inventory working.";
     *
     * var labInventory = new System(options);
     * labInventory.log(text);
     */
    log(text: any): void;
    /**
     * Log an error  message from the System context
     * @instance
     * @param {string} text - Message
     * @fires module:system.System~type_error
     * @example <caption>Usage</caption>
     * var options = {
     *   id: "lab_inventory",
     *   rootDir: "labs",
     *   relativeInitDir: "black_mesa",
     *   initFilename: "inventory.yml",
     *   logging: console
     * };
     * var text = "Testing Lab Inventory error log.";
     *
     * var labInventory = new System(options);
     * labInventory.error(text);
     */
    error(text: any): void;
    /**
     * Fires a system event
     * @instance
     * @param {string} name - Event name, as specified in {@link module:system.System#events}.
     * @param {string=} message - [Optional] Message is not strictly required, but preferred. If not specified, will assume value of the name
     * @throws {external:Error} Will throw `error_hell`. The inability to process error - if {@link module:system.System#events#event:eventFail} event fails.
     * @fires module:system.System#events#eventFail
     * @example <caption>Usage</caption>
     * var options = {
     *   id: "lab_inventory",
     *   rootDir: "labs",
     *   relativeInitDir: "black_mesa",
     *   initFilename: "inventory.yml",
     *   logging: "console"
     * };
     *
     * var labInventory = new System(options);
     * labInventory.fire("system_load_aux", "Auxiliary system loaded.");
     */
    fire(name: any, message: any): void;
    /**
     * Emit an event as a behavior.
     * @instance
     * @param {string} event Behavior name.
     * @example <caption>Usage</caption>
     * // From the lab inventory system context
     * {
     *   // ...
     *
     *   this.behave("system_load_aux");
     *
     *   // ...
     * }
     */
    behave(event: any): void;
    /**
     * Adds a behavior bound to "this".
     * @instance
     * @param {string} event Behavior name.
     * @param {function} callback Behavior.
     * @example <caption>Usage</caption>
     * var options = {
     *   id: "lab_inventory",
     *   rootDir: "labs",
     *   relativeInitDir: "black_mesa",
     *   initFilename: "inventory.yml",
     *   logging: "console"
     * };
     *
     * var labInventory = new System(options);
     * labInventory.on("system_load_aux", function(that){
     *   console.log("Auxiliary system loaded - " + that.system.id);
     * });
     */
    on(event: any, callback: any): void;
    /**
     * Access stderr
     * @param {string} text
     * @example <caption>Usage</caption>
     * system.System.error("Not enough resources.");
     */
    static error(text: any): void;
    /**
     * Access stdout
     * @param {string} text
     * @example <caption>Usage</caption>
     * system.System.log("Resources loaded.");
     */
    static log(text: any): void;
}
