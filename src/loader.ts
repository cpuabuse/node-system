// src/loader.ts
/*
	Contains methods necessary to initialize the system and work with file system.
*/
"use strict";

const path = require("path");
const fs   = require("fs");
const yaml = require("js-yaml");
const loaderError = require("./loaderError.js");

/**
 * Required by system to perform file initialization.
 * @inner
 * @memberof module:system
 */
export class Loader{
	/**
	 * @param {string} rootDir Absolute root directory.
	 * @param {string} relativeInitDir Relative path to root.
	 * @param {string} initFilename Filename.
	 * @param {function} callback Callback to call with Promise of completion.
	 * @throws Will rethrow errors from initRecursion
	 */
	constructor(rootDir, arg_relativeInitDir, arg_initFilename, callback){
		/**
		 * A dummy constructor.
		 */
		function dummyConstructor(){}/* eslint-disable-line no-empty-function */// Empty because dummy
		/**
		 * The standard constructor.
		 */
		var standardConstructor = () => {
			// Initialization recursion; The error handling of the callback will happen asynchronously
			callback(initRecursion(rootDir, arg_relativeInitDir, arg_initFilename, this, true));
		};
		// Determine which constructor to use.
		let previousIsNull = null;
		for (var a = 0; a < arguments.length; a++){
			if (a === 0){
				previousIsNull = arguments[a] === null; /* eslint-disable-line prefer-rest-params */
			} else if (previousIsNull !== (arguments[a] === null)){ /* eslint-disable-line prefer-rest-params */
				throw new loaderError.LoaderError("unexpected_constructor", "Null and String arguments found while deciding the constructor method.");
			}
		}
		/*
			Call the appropriate constructor.
			The execution path for neither true, false or null is removed, since there is no way to reach it.
			It is important to check as "=== false", as we are dealing with null as well.
		*/
		if(previousIsNull === false){
			standardConstructor();
		} else {
			dummyConstructor();
		}
	}

	/**
	 * Gets file contents.
	 * @param {string} rootDir Absolute root directory.
	 * @param {string} relativeDir Directory relative to root.
	 * @param {string} file Full file name.
	 * @returns {external:Promise} File contents.
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
			fs.readFile(path.join(rootDir, relativeDir, file), function(err, data){
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
	 * @returns {string|string[]} Relative path|paths.
	 * @example <caption>Usage</caption>
	 * // Convert path and output the result
	 * console.log(Loader.toRelative("c:\machines\refrigerators", "c:\machines\appliances"));
	 *
	 * // Output
	 * // ..\appliances
	 */
	static toRelative(dir, target){
		if (Array.isArray(target)){
			var targets = new Array(); // Prepare the return array

			// Populate return array
			target.forEach(function(_target){
				targets.push(path.relative(dir, _target));
			})
			// Return an array
			return targets;
		}

		// Return a string if not an array
		return path.relative(dir, target);
	}

	/**
	 * Join a root directory with a file/folder or an array of files/folders to absolute path.
	 * @param {...string|string[]} pathArrays File/folder name|names.
	 * @returns {string|string[]} Absolute path|paths.
	 * @example <caption>Usage</caption>
	 * // Join and log result
	 * console.log(Loader.join("c:\machines", "appliances"))
	 *
	 * // Output
	 * // c:\machines\appliances
	 */
	static join(...pathArrays){
		// Determine maximum pathArray length & construct metadata
		var maxLength = 0;
		var arraysMeta = new Array();
		pathArrays.forEach(function(pathArray){
			let isArray = Array.isArray(pathArray);
			let length = isArray ? pathArray.length : 1;

			// Populate arrays array
			arraysMeta.push({
				isArray,
				length
			});

			// Compare maxLength
			if(length > maxLength){
				maxLength = length;
			}
		});

		// Special case, when args provided were exclusively empty arrays
		if(maxLength === 0) {
			return "";
		}

		// Loop
		let filter = arraysMeta.filter(function(array){
			return array.isArray;
		});
		if(filter.length === 0){
			// Return a string if no arrays
			return path.join(...pathArrays);
		} else { // In case of arrays present
			var results = new Array(); // Prepare the return array
			for(let i = 0; i < maxLength; i++){
				let joinData = new Array();
				pathArrays.forEach(function(pathArray, index){
					let toPush = null;
					let {length} = arraysMeta[index];
					if(arraysMeta[index].isArray){
						if(length < i + 1){
							if(length > 0){
								toPush = pathArray[length];
							}
						} else {
							toPush = pathArray[i];
						}
					} else {
						toPush = pathArray;
					}
					if(toPush !== null){
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
	 * @param {string} rawPath Full filepath.
	 * @returns {external:Promise} Returns `true` if a file, `false` if not.
	 * @example <caption>Usage</caption>
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
	 */
	static isFile(rawPath){
		return new Promise(function(resolve){
			fs.stat(rawPath, function(err, stats){
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
	 * @returns {external:Promise} Returns `true` if a directory, `false` if not.
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
 * @example <caption>Usage</caption>
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
					let checkDefaultStringDirective = function (property) {
						if (init[key].hasOwnProperty(property)){
							if ((typeof init[key][property]) === "string"){
								if (init[key][property] != "") {
									return true;
								}
							}
						}
						return false;
					}

					let checkDefaultBooleanDirective = function (property) {
						if (init[key].hasOwnProperty(property)){
							if ((typeof init[key][property]) === "boolean"){
								return true;
							}
						}
						return false;
					}

					// Set the "extension" values
					if (checkDefaultStringDirective("folder")){
						({folder} = init[key]);
					}
					if (checkDefaultStringDirective("file")){
						({file} = init[key]);
					}
					if (checkDefaultStringDirective("path")){
						if(init[key].path == "relative") {
							pathIsAbsolute = false;
						}
					}
					if (checkDefaultBooleanDirective("extend")){
						if(init[key].extend == true) {
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
 * @example <caption>Usage</caption>
 * var settings = await initSettings("./", "settings", "settings");
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
 * @example <caption>Usage</caption>
 * var settings = await loadYaml("./", "settings", "settings");
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

module.exports = {
	Loader,
	loadYaml
};