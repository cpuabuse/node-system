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
	 * @property {boolean} notMute - Whether the system logs or not.
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
	 */
	constructor(options, behaviors, onError){
		// Throw an error if failure
		if (System.checkOptionsFailure(options)){
			throw new Error("options_fail");
		}

		// First things first, call a loader, if loader has failed, there are no tools to report gracefully, so the errors from there will just go above
		super(options.rootDir, options.relativeInitDir, options.initFilename, load => {
			load.then(() => {
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
					if(onError){
						onError("loader_fail");
					}
					return;
				}

				// Initialize the events
				for (var error in this.errors){
					// Will skip garbled errors
					if (typeof this.errors[error] === "object"){
						// Set default error message for absent message
						let message = "Error message not set.";
						if (error.hasOwnProperty(message)){
							if (typeof error.message === "string"){
								if (error.message != "") {
									({message} = error);
								}
							}
						}
						this.addError(error, message);
					}
				}

				// Initialize the behaviors; If behaviors not provided as argument, it is OK; Not immediate, since the load.then() code will execute after the instance finish initializing.
				if(behaviors){
					this.addBehaviors(behaviors).then(() => this.fire(events.systemLoad));
				} else {
					this.fire(events.systemLoad, "System loading complete.");
				}
			});
		});

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
			notMute: options.notMute
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
			getFile: (dir, file) => new Promise((resolve, reject) => {
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
	 *   notMute: true
	 * };
	 *
	 * if (System.checkOptionsFailure(options)){
	 *   throw new Error ("Options inconsistent.");
	 * }
	 */
	static checkOptionsFailure(options){
		let failed = false;

		if(options === null){
			failed = true;
		} else {
			// Checks boolean
			if(!options.hasOwnProperty("notMute")){
				failed = true;
			} else if(typeof options.notMute !== "boolean"){
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
	 *   notMute: true
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
	 *   notMute: true
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
	 *   notMute: true
	 * };
	 * var text = "Lab Inventory working.";
	 *
	 * var labInventory = new System(options);
	 * labInventory.log(text);
	 */
	log(text){
		if (typeof text === "string"){
			if(this.system.notMute){
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
	 *   notMute: true
	 * };
	 * var text = "Testing Lab Inventory error log.";
	 *
	 * var labInventory = new System(options);
	 * labInventory.error(text);
	 */
	error(text){
		if (typeof text === "string"){
			if(this.system.notMute){
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
	 *   notMute: true
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
			console.log(error)
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
	 *   notMute: true
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