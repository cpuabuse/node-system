/**
 * System is intended more than anything, for centralized managment.
 */
import { AtomicLock } from "./atomic";
import { BehaviorInterface } from "./behavior";
import { Loader } from "./loader";
import { LoaderError } from "./loaderError";
export { AtomicLock };
/** An interface to describe the resolve argument of promise executor. */
export declare type Resolve = (value?: void | PromiseLike<void> | undefined) => void;
export declare type Reject = (reason?: any) => void;
export declare type Executor = (resolve: Resolve, reject: Reject) => void;
/** System options. */
export interface IOptions {
    /** System instace internal ID. */
    id: string;
    /** Initialization file filename. */
    initFilename: string;
    /** The way system logs */
    logging: string;
    /** The relative directory to root of the location of the initialization file. */
    relativeInitDir: string;
    /** The root directory for the System instance. */
    rootDir: string;
}
/** Error callback. */
export interface IErrorCallback {
    (error: LoaderError): void;
}
/**
 * Check if argument is a file or folder (relative to system root directory), or any other filter.
 * @param filterContext Information on the item to be filtered.
 * @returns Promise, containing boolean result.
 */
export interface IFilter {
    (filterContext: FilterContext): Promise<boolean>;
}
/** Filter context. */
declare type FilterContext = {
    /** Parent directory of the filtered item. */
    dir: string;
    /** Path to the filtered item */
    item: string;
    /** Name of the filtered item */
    itemName: string;
};
/**
 * Provides wide range of functionality for file loading and event exchange.
 * Throws standard error if failed to perform basic initializations, or system failure that cannot be reported otherwise has occured.
 * @throws [[Error]]
 *
 * - `loader_failed` - Loader did not construct the mandatory properties
 * // TODO: @event module:system.System#events#systemLoad
 */
export declare class System extends Loader {
    private readonly errors?;
    /**
     * Events to be populated by the loader.
     * System by itself does not deal with events, it only confirms that the events were initialized. Although, if the events are fired, and failure to fire event is set to throw, or undocumented events encountered, it would throw errors.
     */
    private readonly events?;
    /** Contains subsystem data. */
    private readonly subsystems;
    /** Contains system info. */
    private system;
    /**
     * The constructor will perform necessary preparations, so that failures can be processed with system events. Up until these preparations are complete, the failure will result in thrown standard Error.
     * @param options System options.
     * @param behaviors - Behaviors to add.
     * @param onError - Callback for error handling during delayed execution after loader has loaded. Takes error string as an argument.
     */
    constructor({ options, behaviors, onError }: {
        options: IOptions;
        behaviors: BehaviorInterface;
        onError: (IErrorCallback | null);
    });
    /**
     * Checks options argument for missing incorrect property types
     * @param options System options argument
     * @returns Returns true if the arguments is corrupt; false if OK
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
