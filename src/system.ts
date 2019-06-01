// File: system/system.js
/**
 * System is intended more than anything, for centralized managment.
 * @module system
 */

// Imports
import * as events from "./events";
import {Behavior, BehaviorInterface} from "./behavior"; /* eslint-disable-line no-unused-vars */// ESLint type import detection bug
import {AtomicLock} from "./atomic";
import {Loader} from "./loader"; // Auxiliary system lib
import {LoaderError} from "./loaderError";
import {OptionsInterface} from "./subsystems/system.info.options"; /* eslint-disable-line no-unused-vars */// ESLint type import detection bug
import {Subsystem} from "./subsystem"; /* eslint-disable-line no-unused-vars */// ESLint type import detection bug
import {SystemError} from "./error";

// Re-export
export {AtomicLock};

/** An interface to describe the resolve argument of promise executor. */
export type Resolve = (value?: void | PromiseLike<void> | undefined) => void;
export type Reject = (reason?: any) => void;
export type Executor = (resolve: Resolve, reject: Reject) => void;

/** System options. */
export interface SystemArgs{
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
export interface ErrorCallback{
	(error: LoaderError): void;
}

/**
 * Check if argument is a file or folder (relative to system root directory), or any other filter.
 * @param filterContext Information on the item to be filtered.
 * @returns Promise, containing boolean result.
 */
export interface Filter{
	(filterContext: FilterContext): Promise<boolean>;
}

/** Filter context. */
type FilterContext = {
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
export class System extends Loader{
	/** Contains system info. */
	private system!: { // Override compiler, as this property is set from async function callback down the road
		/** Event emitter for the behaviors. Generally should use the public system instance methods instead. Actual behaviors are located here. */
		behavior: Behavior;

		/** Actual errors are located here. */
		error: {
			[key: string]: SystemError;
		};

		/** File system methods. */
		file: {
			/** File cache. */
			cache: {
				/** Array of actual files and reverse indices pointing from files to index */
				files: Array<{rIndex: string}>;

				/** Index pointing to files */
				index: {
					pathToFile: {
						cacheTtl: number;
						expires: number;
						file: Buffer;
					};
				};
			};

			/** Filters */
			filter: {
				/** Check if argument is a folder (relative to system root directory). */
				isDir: Filter;

				/** Check if argument is a file (relative to system root directory). */
				isFile: Filter;
			};

			/**
			 * // TODO: Switch to proper function
			 * Joins two paths.
			 * @param rootDir Relative (to system root) directory.
			 * @param target File/folder path to rootDir.
			 * @returns Promise, containing string path.
			 */
			join: (dir: string | Array<string>, file: string | Array<string>) => Promise<string | Array<string>>;

			/**
			 * // TODO: Switch to proper function
			 * Converts a file path to absolute operating system path. Used for external libraries, that require absolute path.
			 * @param dir Relative directory to the root directory..
			 * @param file Folder/file name.
			 * @returns Promise, containing string relative path.
			 */
			toAbsolute: (dir: string, file: string) => Promise<string>;

			/**
			 * // TODO: Switch to proper function
			 * Converts absolute path to relative path.
			 * @param rootDir Relative (to system root) directory.
			 * @param target Absolute (to system root) file/folder path.
			 * @returns Promise, containing string relative path.
			 */
			toRelative: (dir: string, file: string) => Promise<string>;
		};
		id: string;
		initFilename: string;
		logging: string;
		relativeInitDir: string;
		rootDir: string;

		/** Actual subsystems are located here. */
		subsystem: {
			[key: string]: Subsystem;
		};
	};

	/**
	 * The constructor will perform necessary preparations, so that failures can be processed with system events. Up until these preparations are complete, the failure will result in thrown standard Error.
	 * @param options System options.
	 * @param behaviors - Behaviors to add.
	 * @param onError - Callback for error handling during delayed execution after loader has loaded. Takes error string as an argument.
	 */
	public constructor(options: OptionsInterface, behaviors: BehaviorInterface, onError: ErrorCallback | null){ /* eslint-disable-line constructor-super */// Rule bugs out
		/**
		 * Process the loader error.
		 * Due to the design of the System constructor, this is supposed to be called only once during the constructor execution, no matter the failure.
		 * We do not want the constructor to fail no matter what, so we perform check for onError existence and type. If failed, we ignore it. Moreover, if there was a different error caught, a Loader Error would be generated.
		 * Currently there is no way to produce "other_error"; But the functionality will remain for the possibility of such error thrown with future functionality.
		 */
		function processLoaderError(error: LoaderError): void{
			if(typeof onError === "function"){ // Implied that it is not null
				onError(error instanceof LoaderError ? error : new LoaderError("other_error", "Other error in System constructor has been rethrown as Loader Error."));
			}
		}

		try{
			// Throw an error if failure
			if (System.checkOptionsFailure(options)){
				// Call a dummy superconstructor
				super();

				// Report an error
				throw new LoaderError("system_options_failure", "The options provided to the system constructor are inconsistent.");
			} else { // If no failures
				// First things first, call a loader, if loader has failed, there are no tools to report gracefully, so the errors from there will just go above

				super(options.rootDir, options.relativeInitDir, options.initFilename, load => {
					load.then(() => {
						// Promise is there to maintain full concurrency for maintainability, no functionality implied; Performs the static initialization part of the instance, during superclass constructor execution, so must not depend on it.
						return new Promise((resolve: Resolve): void => {
							// System constants
							this.system = {
								id: options.id,
								rootDir: options.rootDir,
								relativeInitDir: options.relativeInitDir,
								initFilename: options.initFilename,
								logging: options.logging
							};

							/**
							 * Actual subsystems are located here.
							 * @type {module:system~AtomicLock}
							 */
							this.system.subsystem = new Object();

							/**
							 * Actual behaviors are located here.
							 * @type {module:system~Behavior}
							 */
							this.system.behavior = new Behavior();
							/**
							 * Actual errors are located here.
							 * @abstract
							 * @type {Object}
							 */
							this.system.error = new Object();
				
							/**
							 * File system methods.
							 * @type {Object}
							 */
							this.system.file = {
								/**
								 * File cache.
								 * @type {Object}
								 */
								cache: {
									index: {}, // Index pointing to files
									files: [] // Array of actual files and reverse indices pointing from files to index
								},
								/**
								 * File level filters.
								 * @type {Object}
								 */
								filter: {
									/**
									 * Check if argument is a file (relative to system root directory).
									 * @function
									 * @param {module:system.System~filterContext} filterContext Information on the item to be filtered.
									 * @returns {external:Promise} Promise, containing boolean result.
									*/
									isFile: filterContext => Loader.isFile(Loader.join(this.system.rootDir, Loader.join(filterContext.dir, filterContext.itemName))),
									/**
									 * Check if argument is a folder (relative to system root directory).
									 * @function
									 * @param {module:system.System~filterContext} filterContext Information on the item to be filtered
									 * @returns {external:Promise} Promise, containing boolean result.
									*/
									isDir: filterContext => Loader.isDir(this.system.rootDir, filterContext.item)
								},
								/**
								 * Converts a file path to absolute operating system path. Used for external libraries, that require absolute path.
								 * @async
								 * @function
								 * @param {string} dir Relative directory to the root directory..
								 * @param {string} file Folder/file name.
								 * @returns {external:Promise} Promise, containing string relative path.
								*/
								toAbsolute: (dir, file) => new Promise(resolve => {
									let filePath = Loader.join(dir, file);
									resolve(Loader.join(this.system.rootDir, filePath));
								}),
								/**
								 * Converts absolute path to relative path.
								 * @async
								 * @function
								 * @param {string} rootDir Relative (to system root) directory.
								 * @param {string} target Absolute (to system root) file/folder path.
								 * @returns {external:Promise} Promise, containing string relative path.
								*/
								toRelative(rootDir, target){
									return new Promise(function(resolve){
										resolve(Loader.toRelative(rootDir, target));
									});
								},
								/**
								 * Joins two paths.
								 * @async
								 * @function
								 * @param {string} rootDir Relative (to system root) directory.
								 * @param {string} target File/folder path to rootDir.
								 * @returns {external:Promise} Promise, containing string path.
								*/
								join(rootDir, target){
									return new Promise(function(resolve){
										resolve(Loader.join(rootDir, target));
									});
								},
								/**
								 * Get file contents relative to system root directory.
								 * files = [
								 *   {
								 *     file: actual_file,
								 *     rIndex: {
								 *       dir: "dirA",
								 *       file: "fileA"
								 *     }
								 *   },
								 *   {
								 *     file: actual_file_b,
								 *     rIndex: {
								 *       dir: "dirB",
								 *       file: "fileB"
								 *     }
								 *   }
								 * ]
								 * index = {
								 *   "dirA": {
								 *     "FileA": file_entry_link_a
								 *   },
								 *   "dirB": {
								 *     "FileB": file_entry_link_b
								 *   }
								 * }
								 *
								 * @async
								 * @function
								 * @param {string} dir Directory, relative to system root.
								 * @param {string} file Filename.
								 * @returns {external:Promise} Promise, containing string with file contents..
								*/
								getFile: async (dir, file, cacheTtl, force) => {
									// Construct a path
									var pathToFile = Loader.join(dir, file);
				
									// Physically getting the file
									var pGetFile = () => new Promise((resolve, reject) => {
										Loader.getFile(this.system.rootDir, dir, file).then(function(result){
											resolve(result);
										}).catch(error => {
											// this.fire("file_system_error");
											reject(this.system.error.file_system_error);
										});
									});
				
									const maxFiles = 100;
									const defaultCacheTtl = 86400;
									const milliSecondsInSeconds = 1000;
				
									// Set cache to default if not provided
									if(cacheTtl === null){
										cacheTtl = defaultCacheTtl;
									}
									var {index, files} = this.system.file.cache;
									if(maxFiles > 0){
										// Find expiration time and current time
										var currentTimeStamp = Math.trunc(new Date().getTime() / milliSecondsInSeconds);
										var expirationTimeStamp = currentTimeStamp + cacheTtl;
				
										// Find if file is cached
										let cached = false;
										if(index.hasOwnProperty(pathToFile)){
												cached = true;
										}
				
										// Process for cached
										if(cached){
											if (index[pathToFile].cacheTtl === cacheTtl){
												// If expired; Not expired is anticipated to be the most used path
												if(currentTimeStamp > index[pathToFile].expires){
													index[pathToFile].file = await pGetFile();
													index[pathToFile].expires = expirationTimeStamp;
												} else if (force){
													index[pathToFile].file = await pGetFile();
												}
											} else { // New ttl
												if(index[pathToFile].expires > expirationTimeStamp){
													index[pathToFile].expires = expirationTimeStamp;
												}
												index[pathToFile].cacheTtl = cacheTtl;
												if (force){
													index[pathToFile].file = await pGetFile();
												}
											}
										} else { // <== if(cached)
											let nextFile;
											let filesLength = files.length;
				
											// Determine index and prepare space
											if (filesLength >= maxFiles){
												// Update indices
												delete index[files[0].rIndex];
												if(Object.keys(index[files[0].rIndex]).length == 0){
													delete index[files[0].rIndex];
												}
				
												// Shift the array
												files.shift();
				
												// Assign next file index
												nextFile = maxFiles - 1;
											} else {
												nextFile = filesLength;
											}
				
											// Unshift the array
											files.unshift({
												file: await pGetFile(),
												rIndex: {},
												expires: expirationTimeStamp,
												cacheTtl
											});
				
											// Add indices
											index[pathToFile] = files[nextFile];
											files[nextFile].rIndex = pathToFile;
										} // <== if(cached) {} else {...}
										return index[pathToFile].file;
									} else { // <== if(maxFiles > 0)
										return await pGetFile();
									}
								},
								/**
								 * Get contents of yaml file relative to system root directory.
								 * @async
								 * @function
								 * @param {string} dir Directory, relative to system root.
								 * @param {string} file Filename.
								 * @returns {external:Promise} Promise, containing string with file contents..
								*/
								getYaml: (dir, file) => loader.loadYaml(this.system.rootDir, dir, file),
								/**
								 * List the contents of the folder, relative to system root directory.
								 * @async
								 * @function
								 * @param {string} dir Folder relative to system root.
								 * @param {function} filter Filter function.
								 * @returns {external:Promise} Promise, containing an array of filtered strings - files/folders relative to system root.
								 * @example <caption>List folders</caption>
								 * systemInstance.system.file.list("css", systemInstance.system.file.filter.isDir);
								 */
								list: async(dir, filter) => {
									let filteredItems; // Return array
									let itemNames = await Loader.list(this.system.rootDir, dir); // Wait for folder contets
									let items = await this.system.file.join(dir, itemNames);
				
									// Was the filter even specified?
									if(filter !== null){
										filteredItems = new Array(); // Prepare return object
										let {length} = items; // Cache length
										let filterMatches = new Array(); // Operations dataholder; Contains Promises
				
										// Filter and populate promises
										for (let i = 0; i < length; i++){
											// Declare and populate filter context
											var filterContext = {
												dir,
												itemName: itemNames[i],
												item: items[i]
											};
											filterMatches[i] = filter(filterContext);
										}
				
										// Work on results
										await Promise.all(filterMatches).then(values => {
											// Populate return object preserving the order
											for (let i = 0; i < length; i++){
												if(values[i]){
													filteredItems.push(itemNames[i]);
												}
											}
										});
									} else { // <== if(filter !== null)
										filteredItems = itemNames;
									}
				
									// Finally - return filtered items
									return filteredItems;
								} // <== list
							}; // <== file
							resolve();
						});
					}).then(() => { // The following is code dependent on full initialization by static system initializer and Loader.
						try {
							// Initialize subsystems
							if (this.hasOwnProperty("subsystems")){
								for (let subsystem:string in this.subsystems){
									import("./subsystems/" + this.subsystems[subsystem].type).then(subsystemClass => {
										let systemArgs = new Object();
										if(this.subsystems[subsystem].args.includes("system_args")){
											systemArgs["system_args"] = options;
										}

										this.system.subsystem[subsystem] = new subsystemClass({systemContext:this, args:systemArgs, vars:this.subsystems[subsystem].vars});
									});
								}
							}

							/**
							 * Events to be populated by the loader.
							 * System by itself does not deal with events, it only confirms that the events were initialized. Although, if the events are fired, and failure to fire event is set to throw, or undocumented events encountered, it would throw errors.
							 * @abstract
							 * @instance
							 * @member events
							 * @memberof module:system.System
							 * @type {Object}
							 */

							/**
							 * Behavior describtions initialized by loader.
							 * @abstract
							 * @instance
							 * @member behaviors
							 * @memberof module:system.System
							 * @type {Object}
							*/
							if(!(this.hasOwnProperty("events") && this.hasOwnProperty("behaviors"))){ // Make sure basic system carcass was initialized
								throw new LoaderError("loader_fail", "Mandatory initialization files are missing.");
							}

							// Initialize the events
							for (var err in this.errors){
								// Will skip garbled errors
								if (typeof this.errors[err] === "object"){
									// Set default error message for absent message
									let message = "Error message not set.";
									if (this.errors[err].hasOwnProperty("message")){
										if (typeof this.errors[err].message === "string"){
											if (this.errors[err].message != "") {
												({message} = err);
											}
										}
									}
									this.addError(err, message);
								}
							}

							// Initialize the behaviors; If behaviors not provided as argument, it is OK; Not immediate, since the load.then() code will execute after the instance finish initializing.
							if(behaviors){
								this.addBehaviors(behaviors).then(() => this.fire(events.systemLoad));
							} else {
								this.fire(events.systemLoad, "System loading complete.");
							}
						} catch (error){
							processLoaderError(error);
						}
					}).catch(function(error){
						// Errors returned from load or staticInitializationPromise
						processLoaderError(new LoaderError("functionality_error", "There was an error in the loader functionality in constructor subroutines."));
					});
				});
			}
		} catch(error){
			processLoaderError(error);
		}
	} // <== constructor

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
	static checkOptionsFailure(options){
		let failed = false;

		if(options){
			// Checks boolean
			if(!options.hasOwnProperty("logging")){
				failed = true;
			} else if(typeof options.logging !== "string"){
				failed = true;
			} else if(!(["off", "console", "file", "queue"].includes(options.logging))){
				failed = true;
			}

			// Checks strings
			let stringOptions = ["id","rootDir","relativeInitDir","initFilename"];
			stringOptions.forEach(function(element){
				if(!options.hasOwnProperty(element)){
					failed = true;
				} else if(typeof options[element] !== "string"){
					failed = true;
				}
			});
		} else {
			failed = true;
		}
		return failed;
	}

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
	addError(code, message){
		if(this.system.error.hasOwnProperty(code)){
			// Fire an error event that error already exists
			this.fire(events.errorExists, "Error to be added already exists.");
		} else {
			this.system.error[code] = new SystemError(code, message);
		}
	}

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
	async addBehaviors(behaviors){
		if(Array.isArray(behaviors)){ // Sanity check - is an array
			if (behaviors.length > 0){ // Sanity check - is not empty
				// Loop - attachment
				await Promise.all(behaviors.map(element => {
					if(typeof element === "object"){
						let properties = Object.getOwnPropertyNames(element);
						if(properties.length == 1){
							let [key] = properties;
							let value = element[key];
							if(typeof key === "string"){
								if (key.length > 0 && typeof value === "function"){
									return {
										behaviorAdded: this.system.behavior.addBehavior(key, () => value(this)),
										key
									};
								}
								return {
									behaviorAdded: null,
									key
								}
							}
						}
					}
					return null;
				}).map(element => { // Loop - post-attachment event fire
					if(element === null){
						this.fire(events.behaviorAttachFail, "Behavior could not be added.");
						return Promise.resolve();
					} else if (element.behaviorAdded){
						this.fire(events.behaviorAttach, element.key);
						return element.behaviorAdded;
					}

					// Behavior not added
					this.fire(events.behaviorAttachRequestFail, "Event not described.");
					return Promise.resolve();
				}));

				// Terminate if successfully processed arrays
				return;
			}
		}

		// Behaviors not an array || empty array
		this.fire(events.behaviorAttachRequestFail, "Incorrect request.");
	} // <== addBehaviors

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
	log(text){
		if (typeof text === "string"){
			if(this.system.logging === "console"){
				System.log(this.system.id + ": " + text);
			}
		} else {
			// TODO: fix report text etc
			this.fire("type_error", typeof text + " not string.");
		}
	} // <== log

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
	error(text){
		if (typeof text === "string"){
			if(this.system.logging === "console"){
				System.error(this.system.id + ": " + text);
			}
		} else {
			// TODO: fix report text etc
			this.fire("type_error", typeof text + " not string.");
		}
	} // <== log

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
	fire(name, message){
		const eventAbsent = "event_absent";
		const errorHell = "error_hell";

		try{
			let event;

			// Verify event exists
			if(!this.events.hasOwnProperty(name)){
				// throw new system error
				throw new SystemError(this, eventAbsent, "Could not fire an event that is not described.");
			}

			// Locate event
			event = this.events[name];

			// Assign the message, as it is technically optional
			if (!message){
				message = name;
			}

			// Log
			if (event.log){
				this.log(event.log + " - " + message);
			}

			// Error
			if (event.error){
				this.error(name, message);
			}

			// Behavior
			if (event.behavior) {
				this.behave(name);
			}
			// Callback
		} catch (error) {
			let noFail = true;
			if(name == events.eventFail){
				noFail = false;
			}
			if(name == eventAbsent){
				if(SystemError.isSystemError(error)){
					if(error.code == eventAbsent){
						noFail = false;
					}
				}
			}
			if(noFail){
				this.fire(events.eventFail);
			} else {
				throw (errorHell);
			}
		}
	} // <== fire

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
	behave(event){
		try{
			this.log("Behavior - " + this.behaviors[event].text);
		} catch(error){
			this.log("Behavior - Undocumented behavior - " + event)
		}
		this.system.behavior.behave(event);
	}

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
	on(event, callback){
		let behavior = {};
		behavior[event] = () => callback(this);
		this.addBehaviors(behavior);
	}

	/**
	 * Access stderr
	 * @param {string} text
	 * @example <caption>Usage</caption>
	 * system.System.error("Not enough resources.");
	 */
	static error(text){
		console.error("\x1b[31m[Error]\x1b[0m " + text);
	}

	/**
	 * Access stdout
	 * @param {string} text
	 * @example <caption>Usage</caption>
	 * system.System.log("Resources loaded.");
	 */
	static log(text){
		console.log("\x1b[32m[OK]\x1b[0m " + text);
	}
}

module.exports = {
	System,
	AtomicLock: AtomicLock
};