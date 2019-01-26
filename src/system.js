// system/system.js
/**
 * System is intended more than anything, for centralized managment.
 * @module system
 */
"use strict";
const loader = require("./loader.js"); // Auxiliary system lib
const systemError = require("./error.js");
const behavior = require("./behavior.js");
const atomic = require("./atomic.js");
const events = require("./events.js");
const loaderError = require("./loaderError.js");

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
class System extends loader.Loader{
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
	constructor(options, behaviors, onError){
		/**
		 * Process the loader error.
		 * Due to the design of the System constructor, this is supposed to be called only once during the constructor execution, no matter the failure.
		 * We do not want the constructor to fail no matter what, so we perform check for onError existence and type. If failed, we ignore it. Moreover, if there was a different error caught, a Loader Error would be generated.
		 * Currently there is no way to produce "other_error"; But the functionality will remain for the possibility of such error thrown with future functionality.
		 */
		function processLoaderError(error){
			if(onError){
				if(typeof onError === "function"){
					onError(error instanceof loaderError.LoaderError ? error : new loaderError.LoaderError("other_error", "Other error in System constructor has been rethrown as Loader Error."));
				}
			}
		}

		// Performs the static initialization part of the instance, post-superclass constructor
		var staticInitialization = resolve => {
			// System constants
			/** Contains system info.
			 * @type {module:system.System~options}
			 * @readonly
			 * @property {module:system~Behavior} behavior Event emitter for the behaviors. Generally should use the public system instance methods instead.
			 */
			this.system = {
				id: options.id,
				rootDir: options.rootDir,
				relativeInitDir: options.relativeInitDir,
				initFilename: options.relatoveInitFilename,
				logging: options.logging
			};

			/**
			 * Actual behaviors are located here.
			 * @type {module:system~Behavior}
			 */
			this.system.behavior = new behavior.Behavior();
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
					 * @async
					 * @function
					 * @param {module:system.System~filterContext} filterContext Information on the item to be filtered.
					 * @returns {external:Promise} Promise, containing boolean result.
					*/
					isFile: filterContext => loader.Loader.isFile(this.system.rootDir, filterContext.dir, filterContext.itemName),
					/**
					 * Check if argument is a folder (relative to system root directory).
					 * @async
					 * @function
					 * @param {module:system.System~filterContext} filterContext Information on the item to be filtered
					 * @returns {external:Promise} Promise, containing boolean result.
					*/
					isDir: filterContext => loader.Loader.isDir(this.system.rootDir, filterContext.item)
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
					let filePath = loader.Loader.join(dir, file);
					resolve(loader.Loader.join(this.system.rootDir, filePath));
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
						resolve(loader.Loader.toRelative(rootDir, target));
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
						resolve(loader.Loader.join(rootDir, target));
					});
				},
				/**
				 * Get file contents relative to system root directory.
				 * @async
				 * @function
				 * @param {string} dir Directory, relative to system root.
				 * @param {string} file Filename.
				 * @returns {external:Promise} Promise, containing string with file contents..
				*/
				getFile: (dir, file, cacheTtl) => new Promise((resolve, reject) => {
					// const maxFiles = 100;
					// var index = this.system.cache.index;
					// var files = this.system.cache.files;
					// // If requested file is not cached, then read the file and cache it.
					// // If cache is full, pop the first entry, shift the array and then cache it. FIFO = 1 (limit of 5) [1,2,3,4,5]; [2,3,4,5,6]
					// // Find if file is cached
					// let cached = false;
					// if(index.hasOwnProperty(dir)){
					// 	if(index[dir].hasOwnProperty(file)){
					// 		cached = true;
					// 	}
					// }
					// if(!cached){
					// 	if (files.length >= maxFiles){
					// 		// Update indices
					// 		delete index[files[0].rIndex.dir][files[0].rIndex.file];
					// 		/*
					// 		files = [
					// 			{
					// 				file: actual_file,
					// 				rIndex: {
					// 					dir: "dirA",
					// 					file: "FileA"
					// 				}
					// 			}
					// 		]
					// 		index = {
					// 			"dirA": {
					// 				"FileA": file_entry_linkA
					// 			},
					// 			"dirB": {
					// 				"FileB": file_entry_linkB
					// 			}
					// 		}
					// 		*/
					// 		if(Object.keys(index[files[0].rIndex.dir]).length == 0){
					// 			delete index[files[0].rIndex.dir];
					// 		}
					// 		// Shift the array
					// 		files.shift();

					// 		// Unshift the array
					// 		files.unshift({file: loaderTheFile, rIndex: {}});

					// 		// Add indices
					// 		if(!index.hasOwnProperty(dir)){
					// 			index[dir] = new Object();
					// 		}
					// 		index[dir][file] = files[maxFiles - 1];
					// 		files[maxFiles - 1].rIndex = {
					// 			dir,
					// 			file
					// 		};
					// 	}
					// 	//read file(){cache it}
					// }
					// //resolve(index[dir][file].file);
					loader.Loader.getFile(this.system.rootDir, dir, file).then(function(result){
						resolve(result);
					}).catch(error => {
						//	this.fire("file_system_error");
							reject(this.system.error.file_system_error);
						});
				}),
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
					let itemNames = await loader.Loader.list(this.system.rootDir, dir); // Wait for folder contets
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
		}

		try{
			// Throw an error if failure
			if (System.checkOptionsFailure(options)){
				// Call a dummy superconstructor
				super();

				// Report an error
				throw new loaderError.LoaderError("system_options_failure", "The options provided to the system constructor are inconsistent.");
			} else { // If no failures
				// First things first, call a loader, if loader has failed, there are no tools to report gracefully, so the errors from there will just go above
				super(options.rootDir, options.relativeInitDir, options.initFilename, load => {
					Promise.all([load, staticInitializationPromise]).then(() => {
						try {
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
								throw new loaderError.LoaderError("loader_fail", "Mandatory initialization files are missing.");
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
						processLoaderError(new loaderError.LoaderError("functionality_error", "There was an error in the loader functionality in constructor subroutines."));
					});
				});
				// Promise is there to maintain full concurrency for maintainability, no functionality implied
				var staticInitializationPromise = new Promise(staticInitialization);
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
			this.system.error[code] = new systemError.SystemError(code, message);
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
				throw new systemError.SystemError(this, eventAbsent, "Could not fire an event that is not described.");
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
				if(systemError.SystemError.isSystemError(error)){
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
		console.error("[Error] " + text);
	}

	/**
	 * Access stdout
	 * @param {string} text
	 * @example <caption>Usage</caption>
	 * system.System.log("Resources loaded.");
	 */
	static log(text){
		console.log("[OK] " + text);
	}
}

module.exports = {
	System,
	AtomicLock: atomic.AtomicLock
};