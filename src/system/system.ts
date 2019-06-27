/*
	File: src/system/system.js
	cpuabuse.com
*/

/**
 * System is intended more than anything, for centralized managment.
 */

// Imports
import * as events from "../events";
import {
	ISubsystem /* eslint-disable-line no-unused-vars */,
	Subsystem /* eslint-disable-line no-unused-vars */,
	SubsystemEntrypoint /* eslint-disable-line no-unused-vars */
} from "./subsystem";
import { Loader, loadYaml } from "../loader"; // Auxiliary system lib
import { AtomicLock } from "./atomic";
import { LoaderError } from "../loaderError";
import { Behaviors, BehaviorInterface } from "../subsystem/system.behavior";
import {
	OptionsInterface /* eslint-disable-line no-unused-vars */,
	checkOptionsFailure /* eslint-disable-line no-unused-vars */
} from "../subsystem/system.info.options";
import { SystemError } from "../error";

// Re-export
export { AtomicLock, Behaviors, checkOptionsFailure };

/** An interface to describe the resolve argument of promise executor. */
export interface Resolve {
	(value?: void | PromiseLike<void> | undefined): void;
}
/** An interface to describe the reject argument of promise executor. */
export interface Reject {
	(reason?: any): void;
}
/** An interface to describe the promise executor. */
export interface Executor {
	(resolve: Resolve, reject: Reject): void;
}

/** An interface representing a single import durin subsystem initialization. */
interface Import {
	active: boolean;
	depends: Array<string>;
	fn: () => Promise<void>;
}

/** Arguments for [[importRecursion]] function. */
interface ImportRecursionArgs {
	/** Import to be processed. */
	current: string;

	/** Imports array. */
	imports: Imports;

	/** Stack of dependencies up until now. */
	stack: Array<string>;
}

/** An interface to be used for logic, when importaing subsystems. */
interface Imports {
	[key: string]: Import;
}

/** System options. */
export interface Options {
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
export interface ErrorCallback {
	(error: LoaderError): void;
}

/**
 * Check if argument is a file or folder (relative to system root directory), or any other filter.
 * @param filterContext Information on the item to be filtered.
 * @returns Promise, containing boolean result.
 */
export interface Filter {
	(filterContext: FilterContext): Promise<boolean>;
}

/** Filter context. */
interface FilterContext {
	/** Parent directory of the filtered item. */
	dir: string;

	/** Path to the filtered item */
	item: string;

	/** Name of the filtered item */
	itemName: string;
}

/**
 * Object representing file in caching system.
 * To be replaced with FSObject from file-system.
 */
interface FileObject {
	/** Cache time to live. */
	cacheTtl: number;

	/** Expirses date in seconds. */
	expires: number;

	/** Literal file. */
	file: Buffer;

	/** Reverse index pointing to file path. */
	rIndex: string;
}

/** Contains system info. */
interface ISystemProperty {
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
			isDir: Filter;

			/** Check if argument is a file (relative to system root directory). */
			isFile: Filter;
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
		 * systemInstance.private.file.list("css", systemInstance.private.file.filter.isDir);
		 * ```
		 */
		list(dir: string, filter: Filter | null): Promise<Array<string>>;

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

	/** Contains roles. */
	role: {
		/** Subsystem. */
		[key: string]: string;
	};

	/** Actual subsystems are located here. */
	subsystem: {
		[key: string]: Subsystem;
	};
}

/** Type used internally to cast to for operations to confirm correct types of Loader-loaded objects. */
interface LoaderProperty {
	[key: string]: LoaderProperty;
}

/** Arguments for the system. */
interface SystemArgs {
	behaviors?: Behaviors;
	onError?: ErrorCallback;
	options: Options;
}

/** Checks that the data initialized by the loader is proper for the objects. */
function isProperLoaderObject(
	object: { [key: string]: any },
	property: string,
	type: "object" | "string" | "arrayOfString"
): boolean {
	let proper: boolean = false;

	if (Object.prototype.hasOwnProperty.call(object, property)) {
		const objectProperty: any = object[property];
		switch (type) {
			case "arrayOfString":
				if (Array.isArray(objectProperty)) {
					if (
						objectProperty.reduce(function(accumulator: boolean, current: any): boolean {
							return typeof current === "string" && accumulator;
						}, true)
					) {
						proper = true;
					}
				}
				break;

			case "object":
				if (typeof objectProperty === "object" && objectProperty !== null) {
					proper = true;
				}
				break;

			case "string":
				if (typeof objectProperty === "string" && objectProperty !== "") {
					proper = true;
				}
				break;

			default:
		}
	}

	// Return
	return proper;
}

/** Performs import recursion for the subsystems. */
async function importRecursion({ stack, imports, current }: ImportRecursionArgs): Promise<void> {
	// Check for circular dependency
	if (stack.includes(current)) {
		throw new LoaderError(
			"subsystem_circular_depends",
			"System cannot be initialized with subsystem circular dependencies."
		);
	}

	// Process dependencies
	if (!imports[current].active) {
		// Add current to stack
		stack.push(current);

		// Await
		await Promise.all(
			imports[current].depends.map(function(next: string): Promise<void> {
				return importRecursion({
					current: next,
					imports,
					stack: [...stack]
				});
			})
		);

		// Start the import
		await imports[current].fn();

		// Mark this import as active
		imports[current].active = true; /* eslint-disable-line no-param-reassign */ // We are using an argument as a pointer
	}
}

/**
 * Provides wide range of functionality for file loading and event exchange.
 * Throws standard error if failed to perform basic initializations, or system failure that cannot be reported otherwise has occured.
 * @throws [[Error]]
 *
 * - `loader_failed` - Loader did not construct the mandatory properties
 * // TODO: @event module:system.private#events#systemLoad
 */
export class System extends Loader {
	/** Public entrypoints. */
	public public!: {
		subsystem: {
			[key: string]: SubsystemEntrypoint;
		};
	};

	/** Protected entrypoints. */
	protected protected!: {
		subsystem: {
			[key: string]: SubsystemEntrypoint;
		};
	};

	/** Error list. */
	private readonly errors!: {
		[key: string]: {
			/** Error message. */
			message?: string;
		};
	};

	/** Contains system info. */
	private private!: ISystemProperty;

	/** Contains data shared between the subsystems. */
	private shared!: {
		role: {
			/** Subsystem. */
			[key: string]: string;
		};
		subsystem: {
			[key: string]: SubsystemEntrypoint;
		};
	};

	/** Contains subsystem data. */
	private readonly subsystems: any;

	/**
	 * The constructor will perform necessary preparations, so that failures can be processed with system events. Up until these preparations are complete, the failure will result in thrown standard Error.
	 * @param options System options.
	 * @param behaviors - Behaviors to add.
	 * @param onError - Callback for error handling during delayed execution after loader has loaded. Takes error string as an argument.
	 */
	/* eslint-disable-next-line constructor-super */
	public constructor({
		options,
		behaviors,
		onError
	}: {
		behaviors: Behaviors | null;
		onError: ErrorCallback | null;
		options: Options;
	}) {
		/**
		 * Process the loader error.
		 * Due to the design of the System constructor, this is supposed to be called only once during the constructor execution, no matter the failure.
		 * We do not want the constructor to fail no matter what, so we perform check for onError existence and type. If failed, we ignore it. Moreover, if there was a different error caught, a Loader Error would be generated.
		 * Currently there is no way to produce "other_error"; But the functionality will remain for the possibility of such error thrown with future functionality.
		 */
		/* tslint:disable-next-line completed-docs */ // Rule bugs
		function processLoaderError(error: LoaderError): void {
			if (typeof onError === "function") {
				// Implied that it is not null
				onError(
					error instanceof LoaderError
						? error
						: new LoaderError("other_error", "Other error in System constructor has been rethrown as Loader Error.")
				);
			}
		}

		try {
			// Throw an error if failure
			if (checkOptionsFailure(options)) {
				// Call a dummy superconstructor
				super(null, null, null, null);

				// Report an error
				throw new LoaderError(
					"system_options_failure",
					"The options provided to the system constructor are inconsistent."
				);
			}

			// First things first, call a loader, if loader has failed, there are no tools to report gracefully, so the errors from there will just go above
			super(options.rootDir, options.relativeInitDir, options.initFilename, (load: Promise<void>): void => {
				load
					.then(
						(): Promise<void> =>
							(async (): Promise<void> => {
								// It is async by design, not by need
								this.public = {
									subsystem: {}
								};
								this.protected = {
									subsystem: {}
								};

								this.private = new Object() as ISystemProperty;
								this.private.subsystem = new Object() as {
									[key: string]: Subsystem;
								};
								this.private.error = new Object() as {
									[key: string]: SystemError;
								};
								this.private.file = {
									cache: {
										files: [], // Array of actual files and reverse indices pointing from files to index
										index: {} // Index pointing to files
									},
									filter: {
										isDir: (filterContext: FilterContext): Promise<boolean> =>
											Loader.isDir(this.private.subsystem[this.private.role.options].get.rootDir, filterContext.item),
										isFile: (filterContext: FilterContext): Promise<boolean> =>
											Loader.isFile(Loader.join(
												this.private.subsystem[this.private.role.options].get.rootDir,
												Loader.join(filterContext.dir, filterContext.itemName) as string
											) as string) // Only two arguments make string always
									},
									getFile: async (dir: string, file: string, cacheTtl: number, force: boolean): Promise<Buffer> => {
										// Construct a path
										const pathToFile: string = Loader.join(dir, file) as string; // Only two arguments make string always

										// Assign
										const {
											index,
											files
										}: {
											files: FileObject[];
											index: { [key: string]: FileObject };
										} = this.private.file.cache;

										// Physically getting the file
										const pGetFile: () => Promise<Buffer> = (): Promise<Buffer> =>
											(async (): Promise<Buffer> => {
												/* eslint-disable-line func-style */ // Can't have arrow style function declaration
												try {
													return await Loader.getFile(
														this.private.subsystem[this.private.role.options].get.rootDir,
														dir,
														file
													);
												} catch (error) {
													// TODO: this.private.subsystem[this.private.role.behavior].call.fire("fileprivate_error");
													throw this.private.error.file_system_error;
												}
											})();

										const maxFiles: number = 100;
										const defaultCacheTtl: number = 86400;
										const milliSecondsInSeconds: number = 1000; // The functionality is there for future, cacheTtl will be initialized from loader

										// Set cache to default if not provided
										/* tslint:disable-next-line strict-type-predicates */
										if (cacheTtl === null) {
											cacheTtl = defaultCacheTtl; /* tslint:disable-line no-parameter-reassignment */ /* eslint-disable-line no-param-reassign */ // The functionality is there for future, cacheTtl will be initialized from loader
										}
										if (maxFiles > 0) {
											// Find expiration time and current time
											const currentTimeStamp: number = Math.trunc(new Date().getTime() / milliSecondsInSeconds);
											const expirationTimeStamp: number = currentTimeStamp + cacheTtl;

											// Find if file is cached
											let cached: boolean = false;
											if (Object.prototype.hasOwnProperty.call(index, pathToFile)) {
												cached = true;
											}

											// Process for cached
											if (cached) {
												if (index[pathToFile].cacheTtl === cacheTtl) {
													// If expired; Not expired is anticipated to be the most used path
													if (currentTimeStamp > index[pathToFile].expires) {
														index[pathToFile].file = await pGetFile();
														index[pathToFile].expires = expirationTimeStamp;
													} else if (force) {
														index[pathToFile].file = await pGetFile();
													}
												} else {
													// New ttl
													if (index[pathToFile].expires > expirationTimeStamp) {
														index[pathToFile].expires = expirationTimeStamp;
													}
													index[pathToFile].cacheTtl = cacheTtl;
													if (force) {
														index[pathToFile].file = await pGetFile();
													}
												}
											} else {
												// <== if(cached)
												let nextFile: number;
												const filesLength: number = files.length;

												// Determine index and prepare space
												if (filesLength >= maxFiles) {
													// Update indices
													/* tslint:disable-next-line no-dynamic-delete */
													delete index[files[0].rIndex];
													if (Object.keys(index[files[0].rIndex]).length === 0) {
														/* tslint:disable-next-line no-dynamic-delete */
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
									getYaml: (dir: string, file: string): Promise<string> =>
										loadYaml(this.private.subsystem[this.private.role.options].get.rootDir, dir, file),
									async join(rootDir: string, target: string | Array<string>): Promise<string | Array<string>> {
										/* eslint-disable-line require-await */ // We want file methods to produce same type output
										return Loader.join(rootDir, target);
									},
									list: async (dir: string, filter: Filter | null): Promise<Array<string>> => {
										let filteredItems: Array<string>; // Return array
										let itemNames: Array<string> = await Loader.list(
											this.private.subsystem[this.private.role.options].get.rootDir,
											dir
										); // Wait for folder contets
										let items: Array<string> = (await this.private.file.join(dir, itemNames)) as Array<string>; // The return will be always be an array

										// Was the filter even specified?
										if (filter === null) {
											filteredItems = itemNames;
										} else {
											filteredItems = new Array() as Array<string>; // Prepare return object
											let { length }: Array<string> = items; // Cache length
											let filterMatches: Array<Promise<boolean>> = new Array(); // Operations dataholder; Contains Promises

											// Filter and populate promises
											for (let i: number = 0; i < length; i++) {
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
												for (let i: number = 0; i < length; i++) {
													if (values[i]) {
														filteredItems.push(itemNames[i]);
													}
												}
											});
										}

										// Finally - return filtered items
										return filteredItems;
									}, // <== list
									toAbsolute: (dir: string, file: string): Promise<string> =>
										(async (): Promise<string> => {
											/* eslint-disable-line require-await */ // We want file methods to produce same type output
											let filePath: string = Loader.join(dir, file) as string; // Only two arguments make string always

											// Return
											return Loader.join(
												this.private.subsystem[this.private.role.options].get.rootDir,
												filePath
											) as string;
										})(),
									async toRelative(rootDir: string, target: string): Promise<string> {
										/* eslint-disable-line require-await */ // We want file methods to produce same type output
										return Loader.toRelative(rootDir, target) as string; // Only two arguments make string always
									}
								}; // <== file

								// Initialize the roles
								this.private.role = {};

								// Initialize shared
								this.shared = {
									role: this.private.role,
									subsystem: {}
								};
							})()
					)
					.then(async () => {
						// The following is code dependent on full initialization by static system initializer and Loader.
						// Initialize subsystems
						if (isProperLoaderObject(this, "subsystems", "object")) {
							// Assign subsystems shortcut reference
							let subsystems: LoaderProperty = this.subsystems as LoaderProperty;

							// Declare an array of functions to be mapped
							let imports: Imports = new Object() as Imports;

							// Loop through subsystems
							/* eslint-disable-next-line no-restricted-syntax */
							for (let subsystem in subsystems) {
								if (isProperLoaderObject(subsystems, subsystem, "object")) {
									let subsystemsProperty: LoaderProperty = subsystems[subsystem];
									if (isProperLoaderObject(subsystemsProperty, "type", "string")) {
										imports[subsystem] = {
											active: false,
											depends: isProperLoaderObject(subsystems[subsystem], "depends", "arrayOfString")
												? ((subsystems[subsystem].depends as unknown) as Array<string>)
												: new Array(),
											// TODO: Remove the no-loop-func with a rework
											fn: (): Promise<void> /* eslint-disable-line no-loop-func */ =>
												import(`../subsystem/${(subsystemsProperty.type as unknown) as string}`).then(
													(subsystemModule: { default: ISubsystem }): void => {
														// Process roles
														if (isProperLoaderObject(subsystemsProperty, "roles", "arrayOfString")) {
															let roles: Array<string> = (subsystemsProperty.roles as unknown) as Array<string>;
															roles.forEach((element: string): void => {
																// Assigning subsystem name to a role identified by subsystem
																this.private.role[element] = subsystem;
															});
														}

														// Process args
														let resultingArgs: {
															[key: string]: any;
														} = new Object();
														if (isProperLoaderObject(subsystemsProperty, "args", "arrayOfString")) {
															// Define subsystem arguments
															let subsystemArgsProperty: Array<string> = (subsystemsProperty.args as unknown) as Array<
																string
															>;
															// Process the system args
															if (subsystemArgsProperty.includes("system_args")) {
																/* eslint-disable-next-line dot-notation */ /* tslint:disable-next-line no-string-literal */ // Parens are necessary
																resultingArgs["system_args"] = {
																	behaviors,
																	options
																};
															}

															// Process the roles
															if (subsystemArgsProperty.includes("shared")) {
																/* eslint-disable-next-line dot-notation */ /* tslint:disable-next-line no-string-literal */ // Potential future change to some form of the definitions of the strings
																resultingArgs["shared"] = this.shared;
															}
														}

														// Initialize subsystem entrypoints
														this.public.subsystem[subsystem] = new SubsystemEntrypoint();
														this.protected.subsystem[subsystem] = new SubsystemEntrypoint();

														// Initialize subsystem
														this.private.subsystem[
															subsystem
															/* eslint-disable-next-line new-cap */ // It is an argument
														] = new subsystemModule.default({
															args: resultingArgs,
															protectedEntrypoint: this.protected.subsystem[subsystem],
															publicEntrypoint: this.public.subsystem[subsystem],
															system: this,
															vars: subsystemsProperty.vars
														});
													}
												)
										};
									}
								}
							}
							// Await for subsystem load
							await Promise.all(
								Object.keys(imports).map(function(current: string): Promise<void> {
									return importRecursion({ current, imports, stack: new Array() });
								})
							);
						}

						// Initialize the errors
						if (isProperLoaderObject(this, "errors", "object")) {
							Object.keys(this.errors as object).forEach((err: string): void => {
								// Will skip garbled errors
								if (typeof this.errors[err] === "object") {
									/* tslint:disable-line strict-type-predicates */ // It is an argument
									// Set default error message for absent message
									let message: string = "Error message not set.";
									if (Object.prototype.hasOwnProperty.call(this.errors[err], "message")) {
										if (typeof this.errors[err].message === "string") {
											if (this.errors[err].message !== "") {
												({ message } = this.errors[err] as {
													message: string;
												});
											}
										}
									}
									this.addError(err, message);
								}
							});
						}
					})
					.then(() =>
						// Add the behaviors
						this.private.subsystem[this.private.role.behavior].call.addBehaviors(behaviors)
					)
					.then(() =>
						this.private.subsystem[this.private.role.behavior].call.fire(
							events.systemLoad,
							"Behaviors initialized during system loading."
						)
					)
					.catch(function(error: Error | LoaderError): void {
						// Errors returned from load or staticInitializationPromise
						processLoaderError(
							error instanceof LoaderError
								? error
								: new LoaderError(
										"functionality_error",
										"There was an error in the loader functionality in constructor subroutines."
								  )
						);
					});
			});
		} catch (error) {
			processLoaderError(error);
		}
	} // <== constructor

	/**
	 * Access stderr
	 * @param {string} text
	 * @example <caption>Usage</caption>
	 * system.private.error("Not enough resources.");
	 */
	private static error(text: string): void {
		/* eslint-disable-next-line no-console */
		console.error(`\x1b[31m[Error]\x1b[0m ${text}`);
	}

	/**
	 * Access stdout
	 * @param {string} text
	 * @example <caption>Usage</caption>
	 * system.private.log("Resources loaded.");
	 */
	private static log(text: string): void {
		/* eslint-disable-next-line no-console */
		console.log(`\x1b[32m[OK]\x1b[0m ${text}`);
	}

	/** Test error logging. */
	public testError(): void {
		this.error("Test");
	}

	/** Test logging. */
	public testLog(): void {
		this.log("Test");
	}

	/**
	 * Adds an error to the System dynamically
	 * @instance
	 * @param {string} code Error code
	 * @param {string} message Error description
	 * @fires module:system.private#events#errorExists
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
	private addError(code: string, message: string): void {
		if (Object.prototype.hasOwnProperty.call(this.private.error, code)) {
			// Fire an error event that error already exists
			this.private.subsystem[this.private.role.behavior].call.fire(
				events.errorExists,
				"Error to be added already exists."
			);
		} else {
			this.private.error[code] = new SystemError(code, message);
		}
	}

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
	public behave(event: string): void {
		try {
			this.log(`Behavior - ${this.private.subsystem[this.private.role.behavior].get.data[event].text}`);
		} catch (error) {
			this.log(`Behavior - Undocumented behavior - ${event}`);
		}
		this.private.subsystem[this.private.role.behavior].call.behave(event);
	}

	/**
	 * Log an error  message from the System context
	 * @instance
	 * @param {string} text - Message
	 * @fires module:system.private~type_error
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
	public error(text: string): void {
		if (this.private.subsystem[this.private.role.options].get.logging === "console") {
			System.error(`${this.private.subsystem[this.private.role.options].get.id}: ${text}`);
		}
	} // <== error

	/**
	 * Log message from the System context
	 * @instance
	 * @param {string} text - Message
	 * @fires module:system.private~type_error
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
	public log(text: string): void {
		if (this.private.subsystem[this.private.role.options].get.logging === "console") {
			System.log(`${this.private.subsystem[this.private.role.options].get.id}: ${text}`);
		}
	} // <== log

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
	 *   console.log("Auxiliary system loaded - " + that.private.id);
	 * });
	 */
	private on(event: string, callback: (system: System) => void): void {
		let behavior: BehaviorInterface = new Object() as BehaviorInterface;
		behavior[event] = (): void => callback(this);
		this.private.subsystem[this.private.role.behavior].call.addBehaviors([behavior]);
	}
}
