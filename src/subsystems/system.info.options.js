// info.options.js
/*
	Used for storing system options.
*/
const Info = require("system.info.js");

class Options extends Info{
	constructor(systemArgs, constructorArgs, ...subsystemArgs){
		super(null, null, ...subsystemArgs);
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
function checkOptionsFailure(options){
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
		let stringOptions = ["id","rootDir","relativeInitDir","initFilename"];
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