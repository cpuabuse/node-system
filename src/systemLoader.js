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
 * @param {String} rootDir Absolute root directory
 * @param {String} relativeInitDir Relative path to root
 * @param {String} initFilename Filename
 * @param {function} callback Callback to call with Promise of completion
 * @throws {external:Error} Standard error with message
 */
class SystemLoader{
	constructor(rootDir, arg_relativeInitDir, arg_initFilename, callback){
		// Initialization recursion
		callback(initRecursion(rootDir, arg_relativeInitDir, arg_initFilename, this, true));
	}

	/**
	 * Gets file contents
	 * @param {String} rootDir Root directory
	 * @param {String} relativeDir Directory relative to root
	 * @param {String} file Full file name
	 * @returns {external.Promise} File contents
	 */
	static getFile(rootDir, relativeDir, file){
		return new Promise(function(resolve, reject){
			return fs.readFile(path.join(rootDir, relativeDir, file), "utf8", function(err, data){
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
	 * @param {String} rootDir Absolute folder
	 * @param {String|String[]} target File/folder name|names
	 * @returns {external.Promise} Relative path|paths
	 */
	static toRelative(rootDir, target){
		return new Promise(function(resolve){
			if (Array.isArray(target)){
				var targets = new Array(); // Prepare the return array

				// Populate return array
				target.forEach(function(_target){
					targets.push(path.relative(rootDir, _target));
				})
				// Resolve with the array
				resolve(targets);
			} else {
				// Resolve with a string
				resolve(path.relative(rootDir, target));
			}
		});
	}

	/**
	 * Convert a file/folder or array of files/folders to absolute(system absolute) path.
	 * @param {String} rootDir Root folder
	 * @param {String|String[]} target File/folder name|names
	 * @returns {external.Promise} Absolute path|paths
	 */
	static join(rootDir, target){
		return new Promise(function(resolve){
			if (Array.isArray(target)){
				var targets = new Array(); // Prepare the return array

				// Populate return array
				target.forEach(function(target){
					targets.push(path.join(rootDir, target));
				})

				// Resolve with the array
				resolve(targets);
			} else {
				// Resolve with a string
				resolve(path.join(rootDir, target));
			}
		});
	}

	/**
	 * Checks if is a file
	 * @param {Sstring} rootDir Absolute root directory
	 * @param {Sstring} relativeDir Relative directory to root
	 * @param {Sstring} filename Full filename
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
	 * @param {String} rootDir Absolute root directory
	 * @param {String} relativeDir Relative directory to root
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
	 * @param {Sting} rootDir Root directory
	 * @param {String} relativeDir Relative directory
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
	 * @param {String} string YAML string
	 * @returns {object} Javascript object
	 */
	static yamlToObject(string){
		return yaml.load(string);
	}
}

/**
 * @inner
 * @memberof module:system~SystemLoader
 * @param {String} rootDir Root directory
 * @param {object} relativePath Relative path
 * @param {String} initFilename Filename for settings
 * @param {object} targetObject Object to be filled
 * @param {boolean} extend Extend the children objects or not
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
async function initRecursion(
	rootDir,
	relativePath,
	initFilename,
	targetObject,
	extend
){
	// Initialize the initialization file
	let init = await initSettings(rootDir, relativePath, initFilename);
	// Return if no extending
	if(!extend) {
		Object.assign(targetObject, init);
		return;
	}

	// Initialize files
	for (var key in init) {
		let folder = relativePath,
			file = key,
			pathIsAbsolute = true,
			extend = false;
		switch (typeof init[key]){
			case "string": {
				if (init[key] != ""){
					file = init[key];
				}
				break;
			}

			case "object": {
				if(init[key] !== null){ // Custom properties
					// Check if property is set or assume default
					let checkDefaultDirective = function (property) {
						if (init[key].hasOwnProperty(property)){
							if ((typeof init[key][property]) === "string"){
								if (init[key][property] != "") {
									return true;
								}
							}
						}
						return false;
					}

					// Set the "extension" values
					if (checkDefaultDirective("folder")){
						({folder} = init[key]);
					}
					if (checkDefaultDirective("file")){
						({file} = init[key]);
					}
					if (checkDefaultDirective("path")){
						if(init[key].path == "relative") {
							pathIsAbsolute = false;
						}
					}
					if (checkDefaultDirective("extend")){
						if(init[key].extend == "extend") {
							extend = true;
						}
					}
				}
				break;
			} // <== case "object"

			default:
			throw("critical_system_error", "Invalid intialization entry type - " + key);
		}
		await initRecursion(
			rootDir,
			pathIsAbsolute ? folder : path.join(relativePath, folder),
			file,
			targetObject[key] = {},
			extend
		);
	}
}

/**
 * Init and populate globalspace with settings - specific global object member per file.
 * Semantically this function has broader purpose than loadYaml.
 * @inner
 * @memberof module:system~SystemLoader
 * @param {String} rootDir Root directory
 * @param {String} initPath Relative directory to root
 * @param {String} filename Filename
 * @returns {object} Javascript object with settings
 */
async function initSettings(
	rootDir,
	relativeDir,
	filename // Filename, without extention; If null, then varname will be used instead
){
    try {
        // Set the global object from an argument of varname to data from YAML file with path constructed from varname; or filename, if filename provided
        return await loadYaml(rootDir, relativeDir, filename);
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
 * @param {String} rootDir Absolute directory path
 * @param {String} relativeDir Relative directory to root
 * @param {String} filename Filename, with or without extension
 * @returns {external:Promise} Javascript object
 */
async function loadYaml(rootDir, relativeDir, filename){
	var fileExtension = ".yml"; // Making a variale for interpreted language like this would not even save any memory, but it feels right

	// Add file extension if absent
	if(!filename.endsWith(fileExtension)){
		filename += fileExtension;
	}

	// Try to read the file contents and retuen them; If we fail, we log filename to error stream, and rethrow the error
	try {
		var contents = await SystemLoader.getFile(rootDir, relativeDir, filename);
		return yaml.load(contents);
	} catch (err) {
		// Prints path of problem filename
		console.error("Could not open: " + filename);
		throw(err);
	}
}

exports.SystemLoader = SystemLoader;