// info.options.ts
/*
	Used for storing system options.
*/
import {ConstructorArgs} from "../subsystem"; /* eslint-disable-line no-unused-vars */// ESLint type import detection bug
import Info from "./system.info";
import {LoaderError} from "../loaderError";

export interface OptionsInterface{
	id:string;
	rootDir:string;
	relativeInitDir:string;
	initFilename:string;
	logging:string;
};/* eslint-disable-line no-extra-semi */// ESLint inteface no-extra-semi bug

export default class Options extends Info{
	constructor(args:ConstructorArgs){
		console.log("I AM HERE####################################################################################");
		// Set options to be read
		var options = <OptionsInterface>args.args;

		if(checkOptionsFailure(options)){
			// Call a dummy superconstructor
			super({
				systemContext: args.systemContext,
				args: null
			});

			// Report an error
			throw new LoaderError("system_options_failure", "The options provided to the system constructor are inconsistent.");
		} else {
			// Call superclass constructor
			super({
				systemContext: args.systemContext,
				args: options
			});
		}
	}
}

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
*   logging: "off"
* };
*
* if (System.checkOptionsFailure(options)){
*   throw new Error ("Options inconsistent.");
* }
*/
function checkOptionsFailure(options:OptionsInterface){
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