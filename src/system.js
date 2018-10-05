// system/system.js
/**
 * System is intended more than anything, for centralized managment.
 * @module system
 */
"use strict";
const events = require("events");
const loader = require("./systemLoader.js"); // Auxiliary system lib
const systemError = require("./systemError.js");
const error_errorExists = "error_exists";

/**
 * Provides wide range of functionality for file loading and event exchange.
 * @extends module:system~SystemLoader
 * The constructor will perform necessary preparations, so that failures can be processed with system events. Up until these preparations are complete, the failure will result in thrown standard Error.
 * @param {string} id - System instace internal ID
 * @param {string} rootDir - The root directory for the System instance
 * @param {string} relativeInitDir - The relative directory to root of the location of the initialization file
 * @param {string} initFilename - Initialization file filename
 * @param {module:system.System~behavior=} behaviors - [Optional] Behaviors to add
 * @throws {external:Error} Throws standard error if failed to perform basic initializations, or system failure that cannot be reported otherwise has occured.
 *
 * - `loader_failed` - Loader did not construct the property
 *
 * **Note**: typeof SystemError will return false
 * @fires system_load Load complete.
 */
class System extends loader.SystemLoader{
	constructor(id, rootDir, relativeInitDir, initFilename, behaviors){
		// First things first, call a loader, if loader has failed, there are no tools to report gracefully, so the errors from there will just go above
		super(rootDir, relativeInitDir, initFilename, load => {
			load.then(() => {
				/**
				 * Events to be populated by the loader.
				 * System by itself does not do anything about the events themselves, it only confirms that the events were initialized. Ofcourse, if the events are fired, and failure to fire event is set to throw, or undocumented events encountered, it would make troubles(System and standard throws).
				 * @abstract
				 * @member events
				 * @instance
				 * @memberof module:system.System
				 */
				if(!(this.hasOwnProperty("events") && this.hasOwnProperty("behaviors"))){ // Make sure basic system carcass was initialized
					throw new Error("loader_failed");
				}

				// Initialize the events
				for (var error in this.errors){
					// Will skip garbled errors
					if (typeof error === "object"){
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
					this.addBehaviors(behaviors);
				}
				this.fire("system_load");
			});
		});

		// System constants
		/**
		 * Contains system info.
		 * @readonly
		 */
		this.system = {
			/** Instance identifier. */
			id,
			/** Root directory; In general, expecting an absolute path. */
			rootDir,
			/** Relative directory for the settings file. */
			relativeInitDir,
			/** Initial filename. */
			initFilename
		};

		/**
		 * Event emitter for the behaviors. Generally should use the public system instance methods instead.
		 * @private
		 */
		this.system.behavior = new events.EventEmitter();

		/**
		 * Contains throwables
		*/
		this.system.error = {};

		// System methods
		/** File system methods */
		this.system.file = {
			/** File level filters  */
			filter: {
				/** Check if argument is a file (relative to system root directory) */
				isFile: async (folder, file) => await loader.SytemLoader.isFile(this.system.rootDir, folder, file),
				/** Check if argument is a folder (relative to system root directory) */
				isDir: async dir => await loader.SystemLoader.isDir(this.system.rootDir, dir)
			},
			toRelative: async (dir, file) => await loader.SystemLoader.toRelative(dir, file),
			/** Converts relative path to absolute path */
			toAbsolute: async (dir, file) => await loader.SystemLoader.toAbsolute(dir, file),
			/** Get file contents relative to system\ root directory */
			getFile: async (dir, file) => await loader.SystemLoader.getFile(this.system.rootDir, dir, file),
			/** List the contents of the folder, relative to system root directory.
			 * @param {string} folder Folder to check
			 * @param {external:Promise} [filter=null]
			 * @returns {string[]} Filtered files/folders
			 * @example <caption>List folders</caption>
			 * systemInstance.system.file.list("css", systemInstance.system.file.isDir);
			 */
			list: async(dir, filter) => {
				let filteredItems; // Return array
				let items = await loader.SystemLoader.list(this.system.rootDir, dir); // Wait for folder contets
				items = await this.system.file.toAbsolute(dir, items);

				// Was the filter even specified?
				if(filter !== null){
					filteredItems = new Array(); // Prepare return object
					let {length} = items; // Cache length
					let filterMatches = new Array(); // Operations dataholder; Contains Promises

					// Filter and populate promises
					for (let i = 0; i < length; i++){
						filterMatches[i] = filter(items[i]);
					}

					// Work on results
					await Promise.all(filterMatches).then(values => {
						// Populate return object preserving the order
						for (let i = 0; i < length; i++){
							if(values[i]){
								filteredItems.push(items[i]);
							}
						}
					});
				} else { // <== if(filter !== null)
					filteredItems = items;
				}

				// Finally - return filtered items
				return filteredItems;
			}
		};
	} // <== constructor

	/**
	 * Adds an error to the System dynamically
	 * @instance
	 * @param {string} code Error code
	 * @param {string} message Error description
	*/
	addError(code, message){
		if(this.system.error.hasOwnProperty(code)){
			// Fire an error event that error already exists
			this.fire(error_errorExists);
		} else {
			this.system.error[code] = new systemError.SystemError(code, message);
		}
	}

	/**
	 * Adds behaviors to the system, and fires post-addtion events.
	 * Firstly, this function attempts to add the behaviors.
	 * When the behavior addition has been processed, the function will attempt to fire post-addition events, depending on success/failure of behavior additions.
	 * Logically the two stage separation should be done with promises, but due to huge overhead of promises and low total processing required, it will be simplified to syncronous.
	 * @instance
	 * @param {module:system.System~behavior[]} behaviors
	 * @fires module:system.System~behavior_attach
	 * @fires module:system.System~behavior_attach_fail
	 * @fires module:system.System~behavior_attach_request_fail
	 */
	addBehaviors(behaviors){
		if(Array.isArray(behaviors)){ // Sanity check - is an array
			if (behaviors.length > 0){ // Sanity check - is not empty
				// Array to use for firing post addition events
				let postAttachment = [];

				// Loop - attachment
				behaviors.forEach(element => {
					if(typeof element === "object"){
						let properties = Object.getOwnPropertyNames(element);
						if(properties.length == 1){
							let [key] = properties;
							let value = element[key];
							if(typeof key === "string"){
								if (key.length > 0 && typeof value === "function"){
									this.system.behavior.addListener(key, () => value(this));
									postAttachment.push([true, key]);
									return;
								}
								postAttachment.push([false, key]);
								return;
							}
						}
					}
					postAttachment.push(null);
				});

				// Loop - post-attachment event fire
				postAttachment.forEach(element => {
					if(element === null){
						this.fire("behavior_attach_fail", "Request garbage");
					} else if (element[0]){
						this.fire("behavior_attach", element[1]);
					} else {
						this.fire("behavior_attach_fail", "Event not described.");
					}
				});

				// Terminate if successfully processed arrays
				return;
			}
		}

		// Behaviors not an array || empty array
		this.fire("behavior_attach_request_fail");
	} // <== addBehaviors

	/**
	 * Log message from the System context
	 * @instance
	 * @param {string} text - Message
	 * @fires module:system.System~type_error
	 */
	log(text){
		if (typeof text === "string"){
			System.log(this.system.id + ": " + text);
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
	 * @throws {external:Error} Will throw `error_hell`. The inability to process error - if {@link module:system.System~event_fail} event fails.
	 */
	fire(name, message){
		let event_absent = "event_absent";
		let event_fail = "event_fail";
		try{
			let event;

			// Verify event exists
			if(!this.events.hasOwnProperty(name)){
				// throw new system error
				throw new systemError.SystemError(this, "event_absent", "Could not fire an event that is not described.");
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
			if(name == event_fail){
				noFail = false;
			}
			if(name == event_absent){
				if(systemError.SystemError.isSystemError(error)){
					if(error.code == event_absent){
						noFail = false;
					}
				}
			}
			if(noFail){
				this.fire(event_fail);
			} else {
				throw ("error_hell");
			}
		}
	} // <== fire

	/**
	 * Create and process an error
	 * @instance
	 * @param {string} code
	 * @param {string} message
	 */
	processNewSystemError(code, message){
		this.processError(new systemError.SystemError(this, code, message));
	}

	/**
	 * Process a system error - log, behavior or further throw
	 * @instance
	 * @param {(module:system~SystemError|string)} error - SystemError error or error text
	 */
	processError(error){
		// First things first, decide on how this was called
		if (error instanceof systemError.SystemError){ // We process it as plain system error
			let final_text = this.system.id + ": "; // To go to std_err
			try {
				// Try to set a behavior or something...
				let {behavior} = this.errors[error.code];
				console.log(behavior);
				if(typeof behavior === "string"){
					this.behave(behavior);
				}

				// Set text for error log
				final_text += this.errors[error.code].text + " - " + error.message;
			} catch (exception){
				// Complete final text
				final_text += "Error hell."

				// This will generate an exception out of system context since "null" as argument will generate a throw
				this.processNewSystemError(null, "Error hell");
			} finally {
				// Finaly log the error
				System.error(final_text);
			}
		} else { // Out of context
			throw error;
		}
	}

	// FIXME: Do event type right; Add check that behavior exists
	/**
	 * Emit an event as a behavior.
	 * @instance
	 * @param {event} event
	 */
	behave(event){
		if (typeof this.behaviors[event] !== "undefined"){
			this.log("Behavior - " + this.behaviors[event].text);
		} else { // Complain about undocumented behaviors
			this.log("Behavior - Undocumented behavior - " + event)
		}
		this.system.behavior.emit(event);
	}

	on(event,callback){
		let behavior = {};
		behavior[event] = callback;
		this.addBehaviors(behavior);
	}

	/**
	 * Access stderr
	 * @static
	 * @param {string} text
	 */
	static error(text){
		console.error("[Error] " + text);
	}

	/**
	 * Access stdout
	 * @static
	 * @param {string} text
	 */
	static log(text){
		console.log("[OK] " + text);
	}
}

exports.System = System;