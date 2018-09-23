// systemLoader.js
"use strict";

const path = require("path");
const fs   = require("fs");
const yaml = require("js-yaml");

/**
 * Required by system to perform file carcass initialization
 * @inner
 * @memberof module:system
 * @param {string} rootDir 
 * @param {string} relativeInitDir 
 * @param {string} initFilename
 * @throws {external:Error} Standard error with message
 */
class SystemLoader{
	constructor(rootDir, arg_relativeInitDir, arg_initFilename){
		// Initialization recursion
		initRecursion(rootDir, arg_relativeInitDir, arg_initFilename, this);
	}

	/**
	 * Gets file contents
	 */
	static getFile(folder, file){
		return fs.readFileSync(path.join(folder, file), "utf8");
	}
	
	static toRelative(absoluteDir, absoluteFile){
		return new Promise(function(resolve, reject){
			if (Array.isArray(absoluteFile)){
				var files = new Array(); // Prepare the return array

				// Populate return array
				absoluteFile.forEach(function(file){
					files.push(path.relative(absoluteDir, absoluteFile));
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
	 * @param {string} relativeDir
	 * @param {string|string[]} file
	 * @return {external.Promise}
	 */
	static toAbsolute(relativeDir, file){
		return new Promise(function(resolve, reject){
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

	/** Returns `true` if a file, `false` if not */
	static isFile(rootDir, relativeDir, filename){
		return new Promise(function(resolve, reject){
			fs.stat(path.join(rootDir, relativeDir, filename), function(err, stats){
				if (err){
					reject(err);
				} else {
					resolve(!stats.isDirectory());
				}
			});
		});
	} 
	
	/** Returns `true` if a directory, `false` if not */
	static isDir(rootDir, relativeDir){
		return new Promise(function(resolve, reject){
			fs.stat(path.join(rootDir, relativeDir), function(err, stats){
				if (err){
					reject(err);
				} else {
					resolve(stats.isDirectory());
				}
			});
		});
	}
	
	/** 
	 * Returns an array of strings, representing the contents of a folder
	 * @param {sting} root
	 * @param {string} folder
	 * @returns {external:Promise}
	 */
	static list(root, folder){
		return new Promise(function(resolve, reject){
			fs.readdir(path.join(root, folder),function(err, files){
				if (err){
					reject(err);
				} else {
					resolve(files);
				}
			});			
		});
	}

	static yamlToObject(string){
		return yaml.load(string);
	}
}

/**
 * @inner
 * @memberof module:system~SystemLoader
 * @param {string} rootDir 
 * @param {object} sourceObject 
 * @param {string} sourceKey 
 * @param {object} targetObject
 * @example <caption>Default filename - null</caption> @lang yaml
 * # Variable settings to be populated with data from "./settings.yml"
 * [settings:]
 * @example <caption>Default filename - empty string</caption> @lang yaml
 * # Variable settings to be populated with data from "./settings.yml"
 * [settings: ""] 
 * @example <caption>Specified filename</caption> @lang yaml
 * # Variable settings to be populated with data from ".\xxx.yml"
 * [settings: "xxx"]
 * @example <caption>Default extension</caption> @lang yaml
 * # The "extension"(recursion) with default variables will be assumed, so that variable "settings" will be recursively populated with files located in "settings/settings.yml"
 * settings:
 *   folder:
 *   file:
 *   name:
 *   path: # Note: path may be either absolute(default) or relative(relative to the folder from which the file containing instructions is read), the system will not read files outside of system_root_dir tree.
 * @example <caption>Specified extension</caption> @lang yaml
 * # The  "extension"(recursion) with only specified variables will be performed, in this example "settings" variable will be populated with the files described in the "system_root_dir/hello/settings.yml"
 * settings:
 *   folder: "hello"
 *   file:
 *   name:
 *   path: # Note: path may be either absolute(default) or relative(relative to the folder from which the file containing instructions is read), the system will not read files outside of system_root_dir tree.
 */
var initRecursion = function(rootDir, relativePath, initFilename, targetObject){
	// Initialize the initialization file
	let initPath = path.resolve(rootDir, relativePath);
	let init = initSettings(initPath, initFilename);

	// Initialize files
	iterate_properties:
	for (var key in init) {
		switch (typeof init[key]){
			case "object":
			if(init[key] === null){ // Filename is same as the key
				break; 
			} else { // "Extension"	
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

				let folder = checkDefaultDirective("folder");
				let file = checkDefaultDirective("file");	
				let path = "absolute";
	
				targetObject[key] = {};
				initRecursion(rootDir, folder, file, targetObject[key]);	
				
				// Break into for loop
				continue iterate_properties;
			}
			
			case "String": // Standard filename
			if (init[key] == ""){ // Filename is same as the key
				break;
			} else {
			// Specific filename
			targetObject[key] = initSettings(path.resolve(rootDir, relativePath), init[key]);
			}
			break;

			default:
			throw("critical_system_error", "Invalid intialization entry type - " + sourceKey);
		}

		// By default we are looking for the settings files to reside within the initialization folder, but this can be changed later
		targetObject[key] = initSettings(path.resolve(rootDir, relativePath), key);
	}
}

/**
 * Init and populate globalspace with settings - specific global object member per file
 * @inner
 * @memberof module:system~SystemLoader
 * @param {string} initPath 
 * @param {string} filename 
 * @returns {object}
 */
var initSettings = function(
	initPath,
	filename // Filename, without extention; If null, then varname will be used instead
){
    try {
        // Set the global object from an argument of varname to data from YAML file with path constructed from varname; or filename, if filename provided
        return loadYaml(path.join(initPath, filename));
    } catch (err) {
        console.error("Critical file not loaded - " + filename);
        // Error thrown for now. Because the caller handling of the systemErrorLevel variable does not exist yet.
        throw(err);
    }
}

// Parses YAML file, and returns and object; Adds extension if absent
var loadYaml = function(filename){
	var fileExtension = ".yml"; // Making a variale for interpreted language like this would not even save any memory, but it feels right

	// Add file extension if absent
	if(!filename.endsWith(fileExtension)){
		filename += fileExtension;
	}

	// Try to read the file contents and retuen them; If we fail, we log filename to error stream, and rethrow the error
	try {
		var contents = fs.readFileSync(filename, "utf8");
		return yaml.load(contents);
	} catch (err) {
		// Prints path of problem filename
		console.error("Could not open: " + filename);
		throw(err);
	}
}

exports.SystemLoader = SystemLoader;
exports.loadYaml = loadYaml;