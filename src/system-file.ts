/*
	File: src/system-file.ts
	cpuabuse.com
*/

"use strict";
import { System } from "./system";
import { stringify } from "querystring";
const loader = require("loader.js");
const path = require("path");

/**
 * System-lvel abstraction of a file.
 * FsObject stands for "File System Object".
 * @inner
 * @memberof module:system
 */

class FsObject {
	system: System;
	name: string;
	dir: string;
	type: string;
	ext: string;
	/**
	 * Creates an instance of FsObject.
	 * @param {module:system.System} system Parent system reference.
	 * @param {string} relativePath Path, relative to the system root.
	 * @param {promiseCallback} callback Will call back with a promise.
	 */
	constructor(system: System, relativePath: string, callback: (done: Promise<void>) => void) {
		// Set system for instance
		this.system = system;

		// Initialize instance with what can be set
		let parsed = path.parse(relativePath);
		this.name = parsed.name;
		this.dir = parsed.dir;
		this.type = "undefined";

		this.ext = "";

		// A promise to be passed to the callback
		var done = async () => {
			// @ts-ignore
			let { rootDir } = system.system;
			let fullPath = loader.join(rootDir, this.dir, this.name);
			let isFile, isDir;

			// Determine if it is a file or folder
			let isFilePromise = loader.isFile(fullPath).then(function(result: any) {
				isFile = result;
			});
			let isDirPromise = loader.isDir(fullPath).then(function(result: any) {
				isDir = result;
			});

			// Wait for the file or folder results
			await Promise.all([isFilePromise, isDirPromise]);

			// If this is file
			if (isFile && !isDir) {
				this.type = "file";
			}

			// If this is a dir
			if (isDir && !isFile) {
				this.type = "dir";
			}
		};

		// Perform an error-first callback
		callback(done());
	}

	get base() {
		return this.type === "file" ? this.name + this.ext : this.name;
	}

	get path() {
		return loader.join(this.dir, this.base);
	}
}

module.exports = {
	FsObject
};
