// system/system-file.js
/**
 * @module system
 */
"use strict";
const loader = require("loader.js");
const path = require("path");

class FsObject{
	constructor(system, relativeDir, callback){
		let error = null;
		let done = new Promise(resolve => {
			let rootDir = system.system.rootDir;
			let relativeDir = path.parse(relativeDir).dir;
			let filename = path.parse(relativeDir).name;
			loader.isFile(rootDir, relativeDir, filename);
			
			// If this is file
			if(_this_is_file_){
				this.type = "file";
				this.folder = something;
				this.name = something;
				this.ext = something;
			} else if(_this_is_folder_) { // If this is folder
				this.type = "folder"
			} else {
				this.type = "undefined"
			}
		});

		// Perform an error-first callback
		callback(error, ready);
	}

	get rawFilename(){
		return this.name + this.ext;
	}

	get rawPath(){
		return this.folder + this.rawFilename;
	}
}

module.exports = {
	FsObject
}