/*
	File: system/system.js
	cpuabuse.com
*/
/**
 * System is intended more than anything, for centralized managment.
 */

// Imports
import {AtomicLock} from "./atomic";
import {Behavior, BehaviorInterface} from "./behavior"; /* eslint-disable-line no-unused-vars */// ESLint type import detection bug
import {SystemError} from "./error";
import * as events from "./events";
import {Loader, loadYaml} from "./loader"; // Auxiliary system lib
import {LoaderError} from "./loaderError";
import {ISubsystem, Subsystem} from "./subsystem"; /* eslint-disable-line no-unused-vars */// ESLint type import detection bug

// Re-export
export {AtomicLock};

/** An interface to describe the resolve argument of promise executor. */
export type Resolve = (value?: void | PromiseLike<void> | undefined) => void;
export type Reject = (reason?: any) => void;
export type Executor = (resolve: Resolve, reject: Reject) => void;

/** System options. */
export interface IOptions{
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
export interface IErrorCallback{
	(error: LoaderError): void;
}

/**
 * Check if argument is a file or folder (relative to system root directory), or any other filter.
 * @param filterContext Information on the item to be filtered.
 * @returns Promise, containing boolean result.
 */
export interface IFilter{
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
 * Object representing file in caching system.
 * To be replaced with FSObject from file-system.
 */
type FileObject = {
	cacheTtl: number;
	expires: number;
	file: Buffer;
	rIndex: string;
};

/** Contains system info. */
interface ISystemProperty{
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
			files: Array<FileObject>;

			/** Index pointing to files */
			index: {
				[key: string]: FileObject;
			};
		};

		/** Filters */
		filter: {
			/** Check if argument is a folder (relative to system root directory). */
			isDir: IFilter;

			/** Check if argument is a file (relative to system root directory). */
			isFile: IFilter;
		};
		/**
		 * Get file contents relative to system root directory.
		 *
		 * **Structure**
		 *
		 * ```
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
		 * ```
		 *
		 * @param dir Directory, relative to system root.
		 * @param file Filename.
		 * @returns Promise, containing string with file contents.
		 */
		getFile(dir: string, file: string, cacheTtl: number, force: boolean): Promise<Buffer>;

		/**
		 * Get contents of yaml file relative to system root directory.
		 * @param dir Directory, relative to system root.
		 * @param file Filename.
		 * @returns Promise, containing string with file contents..
		 */
		getYaml(dir: string, file: string): Promise<string>;

		/**
		 * // TODO: Switch to proper function
		 * Joins two paths.
		 * @param rootDir Relative (to system root) directory.
		 * @param target File/folder path to rootDir.
		 * @returns Promise, containing string path.
		 */
		join(dir: string | Array<string>, file: string | Array<string>): Promise<string | Array<string>>;

		/**
		 * List the contents of the folder, relative to system root directory.
		 * @param dir Folder relative to system root.
		 * @param filter Filter function.
		 * @returns Promise, containing an array of filtered strings - files/folders relative to system root.
		 *
		 * **Usage - List folders**
		 *
		 * ```typescript
		 * systemInstance.system.file.list("css", systemInstance.system.file.filter.isDir);
		 * ```
		 */
		list(dir: string, filter: IFilter | null): Promise<Array<string>>;

		/**
		 * // TODO: Switch to proper function
		 * Converts a file path to absolute operating system path. Used for external libraries, that require absolute path.
		 * @param dir Relative directory to the root directory..
		 * @param file Folder/file name.
		 * @returns Promise, containing string relative path.
		 */
		toAbsolute(dir: string, file: string): Promise<string>;

		/**
		 * // TODO: Switch to proper function
		 * Converts absolute path to relative path.
		 * @param rootDir Relative (to system root) directory.
		 * @param target Absolute (to system root) file/folder path.
		 * @returns Promise, containing string relative path.
		 */
		toRelative(dir: string, file: string): Promise<string>;
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
}

/** Type used internally to cast to for operations to confirm correct types of Loader-loaded objects. */
type LoaderProperty = {
	[key: string]: LoaderProperty;
};

/** Checks that the data initialized by the loader is proper for the objects. */
function isProperLoaderObject(object: {[key: string]: any}, property: string, type: string): boolean{
	var proper: boolean = false;

	if (object.hasOwnProperty(property)){
		let objectProperty: any = object[property];
		switch(type){
		case "array":
			if(Array.isArray(objectProperty)){
				proper = true;
			}
			break;

		case "object":
			if(typeof objectProperty === "object" && objectProperty !== null){
				proper = true;
			}
			break;

		case "string":
			if(typeof objectProperty === "string" && objectProperty !== ""){
				proper = true;
			}
			break;

		default:
		}
	}

	// Return
	return proper;
}

/**
 * Provides wide range of functionality for file loading and event exchange.
 * Throws standard error if failed to perform basic initializations, or system failure that cannot be reported otherwise has occured.
 * @throws [[Error]]
 *
 * - `loader_failed` - Loader did not construct the mandatory properties
 * // TODO: @event module:system.System#events#systemLoad
 */
export class System extends Loader{
	private readonly errors?: {
		[key: string]: {
			message?: string;
		};
	};

	/**
	 * Events to be populated by the loader.
	 * System by itself does not deal with events, it only confirms that the events were initialized. Although, if the events are fired, and failure to fire event is set to throw, or undocumented events encountered, it would throw errors.
	 */
	private readonly events?: {
		[key: string]: {
			behavior?: boolean;
			error?: string;
			log?: string;
		};
	};

	/** Contains subsystem data. */
	private readonly subsystems: any;

	/** Contains system info. */
	private system!: ISystemProperty; // Override compiler, as this property is set from async function callback down the road

	/**
	 * The constructor will perform necessary preparations, so that failures can be processed with system events. Up until these preparations are complete, the failure will result in thrown standard Error.
	 * @param options System options.
	 * @param behaviors - Behaviors to add.
	 * @param onError - Callback for error handling during delayed execution after loader has loaded. Takes error string as an argument.
	 */
	public constructor({options, behaviors, onError}: {options: IOptions, behaviors: BehaviorInterface, onError: (IErrorCallback | null)}){ /* eslint-disable-line constructor-super */// Rule bugs out
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
			}

			// First things first, call a loader, if loader has failed, there are no tools to report gracefully, so the errors from there will just go above
			super(options.rootDir, options.relativeInitDir, options.initFilename, (load: Promise<void>): void => {
				load.then((): Promise<void> => (async (): Promise<void> => { /* eslint-disable-line require-await */// It is async by design, not by need
					this.system = new Object() as ISystemProperty;
					this.system.id = options.id;
					this.system.rootDir = options.rootDir;
					this.system.relativeInitDir = options.relativeInitDir;
					this.system.initFilename = options.initFilename;
					this.system.logging = options.logging;
					this.system.subsystem = new Object() as {[key: string]: Subsystem};
					this.system.behavior = new Behavior();
					this.system.error = new Object() as {[key: string]: SystemError};
					this.system.file = {
						cache: {
							files: [], // Array of actual files and reverse indices pointing from files to index
							index: {} // Index pointing to files
						},
						filter: {
							isDir: (filterContext: FilterContext): Promise<boolean> => Loader.isDir(this.system.rootDir, filterContext.item),
							isFile: (filterContext: FilterContext): Promise<boolean> => Loader.isFile(Loader.join(this.system.rootDir, Loader.join(filterContext.dir, filterContext.itemName) as string) as string) // Only two arguments make string always
						},
						getFile: async (dir: string, file: string, cacheTtl: number, force: boolean): Promise<Buffer> => {
							// Construct a path
							var pathToFile: string = Loader.join(dir, file) as string; // Only two arguments make string always

							// Assign
							var {index, files} = this.system.file.cache;

							// Physically getting the file
							var pGetFile: () => Promise<Buffer> = (): Promise<Buffer> => (async (): Promise<Buffer> => { /* eslint-disable-line func-style */// Can't have arrow style function declaration
								try{
									return await Loader.getFile(this.system.rootDir, dir, file);
								} catch (error){
									// TODO: this.fire("file_system_error");
									throw this.system.error.file_system_error;
								}
							})();

							const maxFiles: number = 100;
							const defaultCacheTtl: number = 86400;
							const milliSecondsInSeconds: number = 1000;

							// Set cache to default if not provided
							if(cacheTtl === null){ /* tslint:disable-line strict-type-predicates */// The functionality is there for future, cacheTtl will be initialized from loader
								cacheTtl = defaultCacheTtl; /* tslint:disable-line no-parameter-reassignment *//* eslint-disable-line no-param-reassign */// The functionality is there for future, cacheTtl will be initialized from loader
							}
							if(maxFiles > 0){
								// Find expiration time and current time
								let currentTimeStamp: number = Math.trunc(new Date().getTime() / milliSecondsInSeconds);
								let expirationTimeStamp: number = currentTimeStamp + cacheTtl;

								// Find if file is cached
								let cached: boolean = false;
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
									let nextFile: number;
									let filesLength: number = files.length;

									// Determine index and prepare space
									if (filesLength >= maxFiles){
										// Update indices
										delete index[files[0].rIndex];
										if(Object.keys(index[files[0].rIndex]).length === 0){
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
										cacheTtl,
										expires: expirationTimeStamp,
										file: await pGetFile()
									} as FileObject);

									// Add indices
									index[pathToFile] = files[nextFile];
									files[nextFile].rIndex = pathToFile;
								} // End: if(cached) {} else {...}

								// Return
								return index[pathToFile].file;
							}

							// Return
							return pGetFile();
						},
						getYaml: (dir: string, file: string): Promise<string> => loadYaml(this.system.rootDir, dir, file),
						async	join(rootDir: string, target: string | Array<string>): Promise<string | Array<string>>{ /* eslint-disable-line require-await */// We want file methods to produce same type output
							return Loader.join(rootDir, target);
						},
						list: async (dir: string, filter: IFilter | null): Promise<Array<string>> => {
							var filteredItems: Array<string>; // Return array
							var itemNames: Array<string> = await Loader.list(this.system.rootDir, dir); // Wait for folder contets
							var items: Array<string> = await this.system.file.join(dir, itemNames) as Array<string>; // The return will be always be an array

							// Was the filter even specified?
							if(filter === null){
								filteredItems = itemNames;
							} else {
								filteredItems = new Array() as Array<string>; // Prepare return object
								let {length}: Array<string> = items; // Cache length
								let filterMatches: Array<Promise<boolean>> = new Array(); // Operations dataholder; Contains Promises

								// Filter and populate promises
								for (let i: number = 0; i < length; i++){
									// Declare and populate filter context
									let filterContext: FilterContext = {
										dir,
										item: items[i],
										itemName: itemNames[i]
									};
									filterMatches[i] = filter(filterContext);
								}

								// Work on results
								await Promise.all(filterMatches).then((values: Array<boolean>): void => {
									// Populate return object preserving the order
									for (let i: number = 0; i < length; i++){
										if(values[i]){
											filteredItems.push(itemNames[i]);
										}
									}
								});
							}

							// Finally - return filtered items
							return filteredItems;
						}, // <== list
						toAbsolute: (dir: string, file: string): Promise<string> => (async (): Promise<string> => { /* eslint-disable-line require-await */// We want file methods to produce same type output
							let filePath: string = Loader.join(dir, file) as string; // Only two arguments make string always

							// Return
							return Loader.join(this.system.rootDir, filePath) as string;
						})(),
						async toRelative(rootDir: string, target: string): Promise<string>{ /* eslint-disable-line require-await */// We want file methods to produce same type output
							return Loader.toRelative(rootDir, target) as string; // Only two arguments make string always
						}
					}; // <== file
				})()).then(() => { // The following is code dependent on full initialization by static system initializer and Loader.
					try {
						// Initialize subsystems
						if (isProperLoaderObject(this, "subsystems", "object")){
							let subsystems: LoaderProperty = this.subsystems as LoaderProperty;
							for (let subsystem in subsystems){
								if(isProperLoaderObject(subsystems, subsystem, "object")){
									let subsystemsProperty: LoaderProperty = subsystems[subsystem];
									if(isProperLoaderObject(subsystemsProperty, "type", "string")){
										import(`./subsystems/${subsystemsProperty.type as unknown as string}`).then((subsystemClass: ISubsystem): void => {
											let systemArgs: {system_args?: OptionsInterface} = new Object() as {system_args?: OptionsInterface}; /* eslint-disable-line camelcase */// Variables defined in yml file
											if(isProperLoaderObject(subsystemsProperty, "args", "array")){
												if((subsystemsProperty.args as unknown as Array<any>).includes("system_args")){ /* eslint-disable-line no-extra-parens */// Parens are necessary
													systemArgs["system_args"] = options; /* tslint:disable-line no-string-literal */
												}
											}

											this.system.subsystem[subsystem] = new subsystemClass({ /* eslint-disable-line new-cap */// It is an argument
												args: systemArgs,
												systemContext: this,
												vars: subsystemsProperty.vars
											});
										}).catch(function(): void{
											throw new LoaderError("loader_fail", "Could not load defined subsystems.");
										});
									}
								}
							}
						}
						if(!(this.hasOwnProperty("events") && this.hasOwnProperty("behaviors"))){ // Make sure basic system carcass was initialized
							throw new LoaderError("loader_fail", "Mandatory initialization files are missing.");
						}

						// Initialize the events
						for (let err in this.errors){
							// Will skip garbled errors
							if (typeof this.errors[err] === "object"){ /* tslint:disable-line strict-type-predicates */// It is an argument
								// Set default error message for absent message
								let message: string = "Error message not set.";
								if (this.errors[err].hasOwnProperty("message")){
									if (typeof this.errors[err].message === "string"){
										if (this.errors[err].message !== ""){
											({message} = this.errors[err] as {message: string});
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
				}).catch(function(): void{
					// Errors returned from load or staticInitializationPromise
					processLoaderError(new LoaderError("functionality_error", "There was an error in the loader functionality in constructor subroutines."));
				});
			});
		} catch(error){
			processLoaderError(error);
		}
	} // <== constructor

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