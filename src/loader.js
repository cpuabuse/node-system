// loader.js
/*
	Contains methods necessary to initialize the system and work with file system.
*/
"use strict";

const path = require("path");
const fs   = require("fs");
const yaml = require("js-yaml");

/**
 * Required by system to perform file initialization.
 * @inner
 * @memberof module:system
 */
class Loader{
	/**
	 * @param {string} rootDir Absolute root directory.
	 * @param {string} relativeInitDir Relative path to root.
	 * @param {string} initFilename Filename.
	 * @param {function} callback Callback to call with Promise of completion.
	 * @throws Will rethrow errors from initRecursion
	 */
	constructor(rootDir, arg_relativeInitDir, arg_initFilename, callback){
		try{
			// Initialization recursion
			callback(initRecursion(rootDir, arg_relativeInitDir, arg_initFilename, this, true));/* eslint-disable-line callback-return */// Unnecessary here, as there is single execution path
		} catch(error){
			throw error;
		}
	}

	/**
	 * Gets file contents.
	 * @param {string} rootDir Absolute root directory.
	 * @param {string} relativeDir Directory relative to root.
	 * @param {string} file Full file name.
	 * @returns {external.Promise} File contents.
	 * @example <caption>Usage</caption>
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
	 */
	static getFile(rootDir, relativeDir, file){
		return new Promise(function(resolve, reject){
			return fs.readFile(path.join(rootDir, relativeDir, file), function(err, data){
				if (err){
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

	/**
	 * Extracts relative path from rootDir to target.
	 * @param {string} dir Source folder.
	 * @param {string|string[]} target File/folder name|names.
	 * @returns {external:Promise} Relative path|paths.
	 * @example <caption>Usage</caption>
	 * // Convert path and output the result
	 * Loader.toRelative("c:\machines\refrigerators", "c:\machines\appliances").then(function(result){
	 *   console.log(result);
	 * });
	 *
	 * // Output
	 * // ..\appliances
	 */
	static toRelative(dir, target){
		return new Promise(function(resolve){
			if (Array.isArray(target)){
				var targets = new Array(); // Prepare the return array

				// Populate return array
				target.forEach(function(_target){
					targets.push(path.relative(dir, _target));
				})
				// Resolve with the array
				resolve(targets);
			} else {
				// Resolve with a string
				resolve(path.relative(dir, target));
			}
		});
	}

	/**
	 * Join a root directory with a file/folder or an array of files/folders to absolute path.
	 * @param {string} rootDir Root folder.
	 * @param {string|string[]} target File/folder name|names.
	 * @returns {external:Promise} Absolute path|paths.
	 * @example <caption>Usage</caption>
	 * // Join and log result
	 * Loader.join("c:\machines", "appliances").then(function(result){
	 *   console.log(result)
	 * });
	 *
	 * // Output
	 * // c:\machines\appliances
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
	 * @param {string} rootDir Absolute root directory.
	 * @param {string} relativeDir Relative directory to root.
	 * @param {string} filename Full filename.
	 * @returns {boolean} Returns `true` if a file, `false` if not.
	 * @example <caption>Usage</caption>
	 * // Verify file
	 * Loader.isFile("c:\machines","appliances","grapefruitJuicer.txt").then(function(result){
	 *   console.log(result);
	 * });
	 *
	 * // Input - grapefruitJuicer.txt
	 * // 1000W powerful juicer
	 *
	 * // Output
	 * // true
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
	 * Checks if is a directory.
	 * @param {string} rootDir Absolute root directory.
	 * @param {string} relativeDir Relative directory to root.
	 * @returns {boolean} Returns `true` if a directory, `false` if not.
	 * @example <caption>Usage</caption>
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
	 * Returns an array of strings, representing the contents of a folder.
	 * @param {string} rootDir Root directory.
	 * @param {string} relativeDir Relative directory.
	 * @returns {external:Promise} Array with contents; Rejects with errors from [fs.readdir](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback).
	 * @example <caption>Usage</caption>
	 * // List directory contents
	 * Loader.list("c:","machines").then(function(result){
	 *   console.log(result);
	 * }, function(error){
	 *   console.error("Folder not found.");
	 * });
	 *
	 * // Output
	 * // ["machines", "appliances"]
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
	 * Converts YAML string to a JS object.
	 * @param {string} string YAML string.
	 * @returns {Object} Javascript object.
	 * @example <caption>Usage</caption>
	 * // Ouput conversion of YAML to JSON
	 * console.log(Loader.yamlToObject("Wine: Red"));
	 *
	 * // Output
	 * // {"Wine": "Red"}
	 */
	static yamlToObject(string){
		return yaml.load(string);
	}
}

/**
 * System loader recursion.
 *
 * Note:
 *
 * - Default values are assumed for unspecified or empty values.
 * - Extension means recursive loading of data into variable, as if loading a new file into the current variable as new system.
 * - Relative path is relative to the directory location of current file.
 * @inner
 * @memberof module:system~Loader
 * @param {string} rootDir Root directory.
 * @param {Object} relativePath Relative path.
 * @param {string} initFilename Filename for settings.
 * @param {Object} targetObject Object to be filled.
 * @param {boolean} extend Extend the children objects or not.
 * @returns {external:Promise}
 * @throws Will throw an error if the directive is not an allowed one (folder, file, path, extend).
 * @example <caption>Default filename - null</caption> @lang yaml
 * # Variable settings to be populated with data from "system_root_dir/settings.yml"
 * settings: # Defaults to "settings"
 * @example <caption>Default filename - empty string</caption> @lang yaml
 * # Variable settings to be populated with data from "system_root_dir/settings.yml"
 * settings: "" # Defaults to "settings"
 * @example <caption>Specified filename</caption> @lang yaml
 * # Variable settings to be populated with data from "system_root_dir/xxx.yml"
 * settings: "xxx"
 * @example <caption>Default values</caption> @lang yaml
 * # Variable settings to be populated with data from "system_root_dir/settings.yml"
 * settings:
 *   folder: # Defaults to "./"
 *   file: # Defaults to "settings"
 *   path: # Defaults to "absolute"
 *   extend: # Defaults to "false"
 * @example <caption>Specified values</caption> @lang yaml
 * # Variable settings to be populated with data from "current_dir/hello/xxx.yml"
 * settings:
 *   folder: "hello"
 *   file: xxx
 *   path: relative
 *   extend: false
 * @example <caption>Extension</caption> @lang yaml
 * # Variable settings to be populated **recursively** with data from "current_dir/hello/xxx.yml"
 * settings:
 *   folder: "hello"
 *   file: xxx
 *   path: relative
 *   extend: true
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
			throw new Error("Invalid intialization entry type - " + key);
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
 * @memberof module:system~Loader
 * @param {string} rootDir Root directory.
 * @param {string} initPath Relative directory to root.
 * @param {string} filename Filename.
 * @returns {Object} Javascript object with settings.
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
 * Parses YAML file, and returns and object; Adds extension if absent.
 * @inner
 * @memberof module:system~Loader
 * @param {string} rootDir Absolute directory path.
 * @param {string} relativeDir Relative directory to root.
 * @param {string} filename Filename, with or without extension.
 * @returns {external:Promise} Javascript object.
 */
async function loadYaml(rootDir, relativeDir, filename){
	var fileExtension = ".yml"; // Making a variale for interpreted language like this would not even save any memory, but it feels right

	// Add file extension if absent
	if(!filename.endsWith(fileExtension)){
		filename += fileExtension;
	}

	// Try to read the file contents and retuen them; If we fail, we log filename to error stream, and rethrow the error
	try {
		var contents = await Loader.getFile(rootDir, relativeDir, filename);
		return yaml.load(contents);
	} catch (err) {
		// Prints path of problem filename
		console.error("Could not open: " + filename);
		throw(err);
	}
}

exports.Loader = Loader;