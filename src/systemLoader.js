// systemLoader.js
/**
 * Contains methods necessary to initialize the system and work with file system.
*/
"use strict";

const path = require("path");
const fs   = require("fs");
const yaml = require("js-yaml");

/**
 * Required by system to perform file initialization
 * @inner
 * @memberof module:system
 * @param {string} rootDir Absolute root directory
 * @param {string} relativeInitDir Relative path to root
 * @param {string} initFilename Filename
 * @throws {external:Error} Standard error with message
 */
class SystemLoader{
	constructor(rootDir, arg_relativeInitDir, arg_initFilename){
		/**
		 * Contains the loaded data
		 * @instance
		 * @type {external:Object}
		*/
		this.data = {};
		/**
		 * Promise containing result of loading
		 * @instance
		 * @type {external:Promise}
		*/
		// Initialization recursion
		this.load = initRecursion(rootDir, arg_relativeInitDir, arg_initFilename, this.data);
	}

	/**
	 * Gets file contents
	 * @param {string} folder Absolute file location
	 * @param {string} file Full file name
	 * @returns {external.Promise} File contents
	 */
	static getFile(folder, file){
		return new Promise(function(resolve, reject){
			return fs.readFile(path.join(folder, file), "utf8", function(err, data){
				if (err){
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

	/**
	 * Converts absolute path to relative path
	 * @param {string} absoluteDir Absolute file location
	 * @param {string|string[]} absoluteFile File name|names
	 * @returns {external.Promise} Relative path|paths
	 */
	static toRelative(absoluteDir, absoluteFile){
		return new Promise(function(resolve){
			if (Array.isArray(absoluteFile)){
				var files = new Array(); // Prepare the return array

				// Populate return array
				absoluteFile.forEach(function(file){
					files.push(path.relative(absoluteDir, file));
				})

				// Resolve with the array
				resolve(files);
			} else {
				// Resolve with a string
				resolve(path.relative(absoluteDir, absoluteFile));
			}
		});
	}

	/**
	 * Convert a file/folder or array of files/folders to absolute(system absolute) path.
	 * @param {string} relativeDir Relative file location
	 * @param {string|string[]} file File name|names
	 * @returns {external.Promise} Absolute path|paths
	 */
	static toAbsolute(relativeDir, file){
		return new Promise(function(resolve){
			if (Array.isArray(file)){
				var files = new Array(); // Prepare the return array

				// Populate return array
				file.forEach(function(file){
					files.push(path.join(relativeDir, file));
				})

				// Resolve with the array
				resolve(files);
			} else {
				// Resolve with a string
				resolve(path.join(relativeDir, file));
			}
		});
	}

	/**
	 * Checks if is a file
	 * @param {string} rootDir Absolute root directory
	 * @param {string} relativeDir Relative directory to root
	 * @param {string} filename Full filename
	 * @returns {boolean} Returns `true` if a file, `false` if not
	 */
	static isFile(rootDir, relativeDir, filename){
		return new Promise(function(resolve){
			fs.stat(path.join(rootDir, relativeDir, filename), function(err, stats){
				if (err){
					resolve(false);
				} else {
					resolve(!stats.isDirectory());
				}
			});
		});
	}

	/**
	 * Checks if is a directory
	 * @param {string} rootDir Absolute root directory
	 * @param {string} relativeDir Relative directory to root
	 * @returns {boolean} Returns `true` if a directory, `false` if not
	 */
	static isDir(rootDir, relativeDir){
		return new Promise(function(resolve){
			fs.stat(path.join(rootDir, relativeDir), function(err, stats){
				if (err){
					resolve(false);
				} else {
					resolve(stats.isDirectory());
				}
			});
		});
	}

	/**
	 * Returns an array of strings, representing the contents of a folder
	 * @param {sting} rootDir Root directory
	 * @param {string} relativeDir Relative directory
	 * @returns {external:Promise} Array with contents; Rejects with errors from https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback
	 */
	static list(rootDir, relativeDir){
		return new Promise(function(resolve, reject){
			fs.readdir(path.join(rootDir, relativeDir), function(err, files){
				if (err){
					reject(err);
				} else {
					resolve(files);
				}
			});
		});
	}

	/**
	 * Converts YAML string to a JS object
	 * @param {string} string YAML string
	 * @returns {object} Javascript object
	 */
	static yamlToObject(string){
		return yaml.load(string);
	}
}

/**
 * @inner
 * @memberof module:system~SystemLoader
 * @param {string} rootDir Root directory
 * @param {object} relativePath Relative path
 * @param {string} initFilename Filename for settings
 * @param {object} targetObject Object to be filled
 * @returns {external:Promise}
 * @example <caption>Default filename - null</caption> @lang yaml
 * # Variable settings to be populated with data from "system_root_dir/settings.yml"
 * [settings:]
 * @example <caption>Default filename - empty string</caption> @lang yaml
 * # Variable to be assigned an empty string
 * [settings: ""]
 * @example <caption>Specified filename</caption> @lang yaml
 * # Variable settings to be populated with data from "system_root_dir/xxx.yml"
 * [settings: "xxx"]
 * @example <caption>Default extension</caption> @lang yaml
 * # The "extension"(recursion) with default variables will be assumed, so that variable "settings" will be recursively populated with files in "system_root_dir/settings.yml"
 * settings:
 *   folder:
 *   file:
 *   path: # Note: path may be either absolute(default) or relative(relative to the folder from which the file containing instructions is read), the system will not read files outside of system_root_dir tree.
 * @example <caption>Specified extension</caption> @lang yaml
 * # The  "extension"(recursion) with only specified variables will be performed, in this example "settings" variable will be populated with the files described in the "system_root_dir/hello/settings.yml"
 * settings:
 *   folder: "hello"
 *   file:
 *   path: # Note: path may be either absolute(default) or relative(relative to the folder from which the file containing instructions is read), the system will not read files outside of system_root_dir tree.
 */
async function initRecursion(rootDir, relativePath, initFilename, targetObject){
	// Initialize the initialization file
	let initPath = path.resolve(rootDir, relativePath);
	let init = await initSettings(initPath, initFilename);
	// Initialize files
	iterate_properties:
	for (var key in init) {
		switch (typeof init[key]){
			case "string": {
				// Assing the target key the string value
				targetObject[key] = init[key];

				// Break into for loop
				continue iterate_properties;
			} // ...case "string"

			// "Extension"
			case "object": {
				let folder, file, pathIsAbsolute;
				if(init[key] === null){ // Filename is same as the key
					folder = relativePath;
					file = key;
					pathIsAbsolute = true;
				} else { // "Extension"
					// Check if property is set or assume default
					let checkDefaultDirective = function (property) {
						if (init[key].hasOwnProperty(property)){
							if ((typeof init[key][property]) === "string"){
								if (init[key][property] != "") {
									return init[key][property];
								}
							}
						}
						return key;
					}
					// Check if property is set or assume default for path type
					let checkDefaultPathDirective = function (property) {
						if (init[key].hasOwnProperty(property)){
							if ((typeof init[key][property]) === "string"){
								if (init[key][property] == "relative") {
									return false;
								}
							}
						}
						return true;
					}

					// Set the "extension" values
					folder					= checkDefaultDirective("folder");
					file						= checkDefaultDirective("file");
					pathIsAbsolute	= checkDefaultPathDirective("path");
				}

				targetObject[key] = {};
				await initRecursion(rootDir, pathIsAbsolute ? folder : path.join(relativePath, folder), file, targetObject[key]);

			} // ...case "object"
			continue iterate_properties;

			default:
			throw("critical_system_error", "Invalid intialization entry type - " + key);
		}
	}
}

/**
 * Init and populate globalspace with settings - specific global object member per file.
 * Semantically this function has broader purpose than loadYaml.
 * @inner
 * @memberof module:system~SystemLoader
 * @param {string} initPath Path to the settings file
 * @param {string} filename Filename
 * @returns {object} Javascript object with settings
 */
async function initSettings(
	initPath,
	filename // Filename, without extention; If null, then varname will be used instead
){
    try {
        // Set the global object from an argument of varname to data from YAML file with path constructed from varname; or filename, if filename provided
        return await loadYaml(initPath, filename);
    } catch (err) {
        console.error("Critical file not loaded - " + filename);
        // Error thrown for now. Because the caller handling of the systemErrorLevel variable does not exist yet.
        throw(err);
    }
}

/**
 * Parses YAML file, and returns and object; Adds extension if absent
 * @inner
 * @memberof module:system~SystemLoader
 * @param {string} directory Absolute directory path
 * @param {string} filename Filename, with or without extension
 * @returns {external:Promise} Javascript object
 */
async function loadYaml(directory, filename){
	var fileExtension = ".yml"; // Making a variale for interpreted language like this would not even save any memory, but it feels right

	// Add file extension if absent
	if(!filename.endsWith(fileExtension)){
		filename += fileExtension;
	}

	// Try to read the file contents and retuen them; If we fail, we log filename to error stream, and rethrow the error
	try {
		var contents = await SystemLoader.getFile(directory, filename);
		return yaml.load(contents);
	} catch (err) {
		// Prints path of problem filename
		console.error("Could not open: " + filename);
		throw(err);
	}
}

exports.SystemLoader = SystemLoader;