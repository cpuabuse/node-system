/*	
	File: info.options.ts
	cpuabuse.com
*/

/** 
 * Used for storing system options.
 */

import {ConstructorArgs} from "../subsystem"; /* eslint-disable-line no-unused-vars */// ESLint type import detection bug
import Info from "./system.info";
import {LoaderError} from "../loaderError";
import {ISystemArgs} from "../system"; /* eslint-disable-line no-unused-vars */// ESLint type import detection bug

interface OptionsVars{
	homepage: string;
};/* eslint-disable-line no-extra-semi */// ESLint inteface no-extra-semi bug
export interface OptionsInterface extends ISystemArgs, OptionsVars{};/* eslint-disable-line no-extra-semi */// ESLint inteface no-extra-semi bug

export default class Options extends Info{
	constructor(args:ConstructorArgs){
		// Set options to be read
		if (args.args !== null){
			if(args.args.hasOwnProperty("system_args")){
				// Assign system option args
				let options = <SystemArgs>args.args["system_args"];

				// Check options failure
				if(!checkOptionsFailure(options)){
					let vars:OptionsInterface = {
						...options,
						...<OptionsVars>args.vars
					};

					// Call superclass constructor
					super({
						systemContext: args.systemContext,
						args: null,
						vars
					});

					// Terminate function execution
					return;
				}
			}
		}

		// Call superconstructor with dummy arguments
		super({
			systemContext: args.systemContext,
			args: null,
			vars: null
		});

		// Report an error
		throw new LoaderError("system_options_failure", "The options provided to the system constructor are inconsistent.");
	}
}

/**
 * Checks options argument for missing incorrect property types
 * @param {module:system~System~SystemArgs} options System options argument
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
function checkOptionsFailure(options:SystemArgs){
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
		let stringOptions:("id" | "rootDir" | "relativeInitDir" | "initFilename")[] = ["id","rootDir","relativeInitDir","initFilename"];
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

module.exports = Options;