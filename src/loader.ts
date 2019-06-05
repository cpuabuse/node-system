/*
	File: src/loader.ts
	cpuabuse.com
*/

/**
 * Contains methods necessary to initialize the system and work with file system.
 */

import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

import { LoaderError } from "./loaderError";

/**
 * Constructor callback.
 * @param done Fullfills when constructor finishes execution
 */
export type ConstructorCallback = (done: Promise<void>) => void;

/** Required by system to perform file initialization. */
export class Loader {
	/**
	 * Extracts relative path from rootDir to target.
	 *
	 * **Usage**
	 *
	 * ```typescript
	 * // Convert path and output the result
	 * console.log(Loader.toRelative("c:\machines\refrigerators", "c:\machines\appliances"));
	 *
	 * // Output
	 * // ..\appliances
	 * ```
	 * @param dir Source folder.
	 * @param target File/folder name|names.
	 * @returns Relative path|paths.
	 */
	public static toRelative(
		dir: string,
		target: string | Array<string>
	): string | Array<string> {
		if (Array.isArray(target)) {
			let results: Array<string> = new Array() as Array<string>; // Prepare the return array

			// Populate return array
			target.forEach(function(targetMember: string): void {
				results.push(path.relative(dir, targetMember));
			});

			// Return an array
			return results;
		}

		// Return a string if not an array
		return path.relative(dir, target);
	}

	/**
	 * @param rootDir Absolute root directory.
	 * @param relativeInitDir Relative path to root.
	 * @param initFilename Filename.
	 * @param callback Callback to call with Promise of completion.
	 * @throws [[LoaderError]] Will throw `unexpected_constructor`
	 */
	public constructor(
		rootDir: string | null,
		arg_relativeInitDir: string | null,
		arg_initFilename: string | null,
		callback: ConstructorCallback | null
	) {
		/** A dummy constructor. */
		function dummyConstructor() {} /* eslint-disable-line no-empty-function */ // Empty because dummy

		/** The standard constructor. */
		var standardConstructor = () => {
			// Initialization recursion; The error handling of the callback will happen asynchronously
			callback(
				initRecursion(
					rootDir,
					arg_relativeInitDir,
					arg_initFilename,
					this,
					true
				)
			);
		};

		// Determine which constructor to use.
		let previousIsNull: boolean | null = null;
		for (var a = 0; a < arguments.length; a++) {
			if (a === 0) {
				previousIsNull =
					arguments[a] === null; /* eslint-disable-line prefer-rest-params */
			} else if (previousIsNull !== (arguments[a] === null)) {
				/* eslint-disable-line prefer-rest-params */
				throw new LoaderError(
					"unexpected_constructor",
					"Null and String arguments found while deciding the constructor method."
				);
			}
		}

		/*
			Call the appropriate constructor.
			The execution path for neither true, false or null is removed, since there is no way to reach it.
			It is important to check as "=== false", as we are dealing with null as well.
		*/
		if (previousIsNull === false) {
			standardConstructor();
		} else {
			dummyConstructor();
		}
	}

	/**
	 * Gets file contents.
	 *
	 * **Usage**
	 *
	 * ```typescript
	 * // Load files
	 * var grapefruitJuicer = Loader.getFile("c:\machines", "appliances", "grapefruitJuicer.txt");
	 *
	 * // Output the result
	 * grapefruitJuicer.then(function(result){ // grapefruitJuicer - on resolve
	 *   console.log(result);
	 * }, function(error){ // grapefruitJuicer - on reject
	 *   console.error("Could not load a file.");
	 * });
	 *
	 * // Input - grapefruitJuicer.txt
	 * // 1000W powerful juicer
	 *
	 * // Output
	 * // 1000W powerful juicer
	 * ```
	 * @param rootDir Absolute root directory.
	 * @param relativeDir Directory relative to root.
	 * @param file Full file name.
	 * @returns File contents.
	 */
	static getFile(
		rootDir: string,
		relativeDir: string,
		file: string
	): Promise<Buffer> {
		return new Promise(function(resolve, reject) {
			fs.readFile(path.join(rootDir, relativeDir, file), function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

	/**
	 * Join a root directory with a file/folder or an array of files/folders to absolute path.
	 *
	 * **Usage**
	 *
	 * ```typescript
	 * // Join and log result
	 * console.log(Loader.join("c:\machines", "appliances"))
	 *
	 * // Output
	 * // c:\machines\appliances
	 * ```
	 * @param pathArrays File/folder name|names.
	 * @returns Absolute path|paths.
	 */
	static join(
		...pathArrays: Array<string | Array<string>>
	): string | Array<string> {
		// Determine maximum pathArray length & construct metadata
		var maxLength: number = 0;
		var arraysMeta: Array<{ isArray: boolean; length: number }> = new Array();
		pathArrays.forEach(function(pathArray) {
			let isArray: boolean = Array.isArray(pathArray);
			let length: number = isArray ? pathArray.length : 1;

			// Populate arrays array
			arraysMeta.push({
				isArray,
				length
			});

			// Compare maxLength
			if (length > maxLength) {
				maxLength = length;
			}
		});

		// Special case, when args provided were exclusively empty arrays
		if (maxLength === 0) {
			return "";
		}

		// Loop
		let filter: Array<{ isArray: boolean; length: number }> = arraysMeta.filter(
			function(array) {
				return array.isArray;
			}
		);
		if (filter.length === 0) {
			// Return a string if no arrays
			return path.join(...(<Array<string>>pathArrays)); // Casting due to inability of compiler to detect that there are no other types possible
		} else {
			// In case of arrays present
			var results: Array<string> = new Array(); // Prepare the return array
			for (let i = 0; i < maxLength; i++) {
				let joinData: Array<string> = new Array();
				pathArrays.forEach(function(pathArray, index) {
					let toPush: string | null = null;
					let { length }: { isArray: boolean; length: number } = arraysMeta[
						index
					];
					if (arraysMeta[index].isArray) {
						if (length < i + 1) {
							if (length > 0) {
								toPush = pathArray[length];
							}
						} else {
							toPush = pathArray[i];
						}
					} else {
						toPush = <string>pathArray; // Casting due to inability of compiler to detect that there are no other types possible
					}
					if (toPush !== null) {
						joinData.push(toPush);
					}
				});
				results.push(path.join(...joinData));
			}
			return results;
		}
	}

	/**
	 * Checks if is a file
	 *
	 * **Usage**
	 *
	 * ```typescript
	 * // Verify file
	 * Loader.isFile("c:\machines\appliances\grapefruitJuicer.txt").then(function(result){
	 *   console.log(result);
	 * });
	 *
	 * // Input - grapefruitJuicer.txt
	 * // 1000W powerful juicer
	 *
	 * // Output
	 * // true
	 * ```
	 * @param rawPath Full filepath.
	 * @returns Returns `true` if a file, `false` if not.
	 */
	static isFile(rawPath: string): Promise<boolean> {
		return new Promise(function(resolve) {
			fs.stat(rawPath, function(err, stats) {
				if (err) {
					resolve(false);
				} else {
					resolve(!stats.isDirectory());
				}
			});
		});
	}

	/**
	 * Checks if is a directory.
	 *
	 * **Usage**
	 *
	 * ```typescript
	 * // Verify directory
	 * Loader.isDir("c:\machines\appliances","grapefruitJuicer.txt").then(function(result){
	 *   console.log(result);
	 * });
	 *
	 * // Input - grapefruitJuicer.txt
	 * // 1000W powerful juicer
	 *
	 * // Output
	 * // false
	 * ```
	 * @param rootDir Absolute root directory.
	 * @param relativeDir Relative directory to root.
	 * @returns Returns `true` if a directory, `false` if not.
	 */
	static isDir(rootDir: string, relativeDir: string): Promise<boolean> {
		return new Promise(function(resolve) {
			fs.stat(path.join(rootDir, relativeDir), function(err, stats) {
				if (err) {
					resolve(false);
				} else {
					resolve(stats.isDirectory());
				}
			});
		});
	}

	/**
	 * Returns an array of strings, representing the contents of a folder.
	 *
	 * **Usage**
	 *
	 * ```typescript
	 * // List directory contents
	 * Loader.list("c:","machines").then(function(result){
	 *   console.log(result);
	 * }, function(error){
	 *   console.error("Folder not found.");
	 * });
	 *
	 * // Output
	 * // ["machines", "appliances"]
	 * ```
	 * @param rootDir Root directory.
	 * @param relativeDir Relative directory.
	 * @returns Array with contents; Rejects with errors from [fs.readdir](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback).
	 */
	static list(rootDir: string, relativeDir: string): Promise<Array<string>> {
		return new Promise(function(resolve, reject) {
			fs.readdir(path.join(rootDir, relativeDir), function(err, files) {
				if (err) {
					reject(err);
				} else {
					resolve(files);
				}
			});
		});
	}

	/**
	 * Converts YAML string to a JS object.
	 *
	 *  **Usage**
	 *
	 * ```typescript
	 * // Ouput conversion of YAML to JSON
	 * console.log(Loader.yamlToObject("Wine: Red"));
	 *
	 * // Output
	 * // {"Wine": "Red"}
	 * ```
	 * @param string YAML string.
	 * @returns Javascript object.
	 */
	static yamlToObject(string: string): any {
		return yaml.load(string);
	}
}

/**
 * System loader recursion.
 *
 * **Note**
 *
 * - Default values are assumed for unspecified or empty values.
 * - Extension means recursive loading of data into variable, as if loading a new file into the current variable as new system.
 * - Relative path is relative to the directory location of current file.
 *
 *  **Default filename - null**
 *
 * ```yaml
 * # Variable settings to be populated with data from "system_root_dir/settings.yml"
 * settings: # Defaults to "settings"
 * ```
 *
 * **Default filename - empty string**
 *
 * ```yaml
 * # Variable settings to be populated with data from "system_root_dir/settings.yml"
 * settings: "" # Defaults to "settings"
 * ```
 *
 * **Specified filename**
 *
 * ```yaml
 * # Variable settings to be populated with data from "system_root_dir/xxx.yml"
 * settings: "xxx"
 * ```
 *
 * **Default values**
 *
 * ```yaml
 * # Variable settings to be populated with data from "system_root_dir/settings.yml"
 * settings:
 *   folder: # Defaults to "./"
 *   file: # Defaults to "settings"
 *   path: # Defaults to "absolute"
 *   extend: # Defaults to "false"
 * ```
 *
 * **Specified values**
 *
 * ```yaml
 * # Variable settings to be populated with data from "current_dir/hello/xxx.yml"
 * settings:
 *   folder: "hello"
 *   file: xxx
 *   path: relative
 *   extend: false
 * ```
 *
 * **Extension**
 *
 * ```yaml
 * # Variable settings to be populated **recursively** with data from "current_dir/hello/xxx.yml"
 * settings:
 *   folder: "hello"
 *   file: xxx
 *   path: relative
 *   extend: true
 * ```
 *
 * **Usage**
 *
 * ```typescript
 * // Input - ./settings/init.yml
 * // settings:
 * //   path: relative
 *
 * // Input - ./settings/settings.yml
 * // apples: red
 * // bananas: yellow
 *
 * // Target object to fill
 * var targetObject = {};
 *
 * initRecursion("./", "settings", "init.yml", targetObject, true));
 * ```
 * @param rootDir Root directory.
 * @param relativePath Relative path.
 * @param initFilename Filename for settings.
 * @param targetObject Object to be filled.
 * @param extend Extend the children objects or not.
 * @throws [[Error]] Will throw an error if the directive is not an allowed one (folder, file, path, extend).
 */
async function initRecursion(
	rootDir: string,
	relativePath: string,
	initFilename: string,
	targetObject: any,
	extend: boolean
) {
	// Initialize the initialization file
	let init = await initSettings(rootDir, relativePath, initFilename);
	// Return if no extending
	if (!extend) {
		Object.assign(targetObject, init);
		return;
	}

	// Initialize files
	for (var key in init) {
		let folder: string = relativePath,
			file: string = key,
			pathIsAbsolute: boolean = true,
			extend: boolean = false;
		switch (typeof init[key]) {
			case "string": {
				if (init[key] != "") {
					file = init[key];
				}
				break;
			}

			case "object": {
				if (init[key] !== null) {
					// Custom properties
					// Check if property is set or assume default
					let checkDefaultStringDirective: (
						property: string
					) => boolean = function(property) {
						if (init[key].hasOwnProperty(property)) {
							if (typeof init[key][property] === "string") {
								if (init[key][property] != "") {
									return true;
								}
							}
						}
						return false;
					};

					let checkDefaultBooleanDirective: (
						property: string
					) => boolean = function(property) {
						if (init[key].hasOwnProperty(property)) {
							if (typeof init[key][property] === "boolean") {
								return true;
							}
						}
						return false;
					};

					// Set the "extension" values
					if (checkDefaultStringDirective("folder")) {
						({ folder } = init[key]);
					}
					if (checkDefaultStringDirective("file")) {
						({ file } = init[key]);
					}
					if (checkDefaultStringDirective("path")) {
						if (init[key].path == "relative") {
							pathIsAbsolute = false;
						}
					}
					if (checkDefaultBooleanDirective("extend")) {
						if (init[key].extend == true) {
							extend = true;
						}
					}
				}
				break;
			} // <== case "object"

			default:
				throw new Error("Invalid intialization entry type - " + key);
		}
		await initRecursion(
			rootDir,
			pathIsAbsolute ? folder : path.join(relativePath, folder),
			file,
			(targetObject[key] = {}),
			extend
		);
	}
}

/**
 * Init and populate globalspace with settings - specific global object member per file.
 * Semantically this function has broader purpose than loadYaml.
 *
 * **Usage**
 *
 * ```typescript
 * var settings = await initSettings("./", "settings", "settings");
 * ```
 * @param rootDir Root directory.
 * @param initPath Relative directory to root.
 * @param filename Filename.
 * @returns Javascript object with settings.
 */
async function initSettings(
	rootDir: string,
	relativeDir: string,
	filename: string // Filename, without extention; If null, then varname will be used instead
) {
	try {
		// Set the global object from an argument of varname to data from YAML file with path constructed from varname; or filename, if filename provided
		return await loadYaml(rootDir, relativeDir, filename);
	} catch (err) {
		// Error thrown for now. Because the caller handling of the systemErrorLevel variable does not exist yet.
		throw err;
	}
}

/**
 * Parses YAML file, and returns and object; Adds extension if absent.
 *
 * **Usage**
 *
 * ```typescript
 * var settings = await loadYaml("./", "settings", "settings");
 * ```
 * @param rootDir Absolute directory path.
 * @param relativeDir Relative directory to root.
 * @param filename Filename, with or without extension.
 * @returns Javascript object.
 */
export async function loadYaml(
	rootDir: string,
	relativeDir: string,
	filename: string
) {
	var fileExtension: string = ".yml"; // Making a variable for interpreted language like this would not even save any memory, but it feels right

	// Add file extension if absent
	if (!filename.endsWith(fileExtension)) {
		filename += fileExtension;
	}

	// Try to read the file contents and return them; If we fail, we log filename to error stream, and rethrow the error
	try {
		var contents: Buffer = await Loader.getFile(rootDir, relativeDir, filename);
		return yaml.load(contents.toString());
	} catch (err) {
		throw err;
	}
}
