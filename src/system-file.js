// src/system-file.ts
"use strict";
const loader = require("loader.js");
const path = require("path");
/**
 * System-lvel abstraction of a file.
 * FsObject stands for "File System Object".
 * @inner
 * @memberof module:system
 */
class FsObject {
    /**
     * Creates an instance of FsObject.
     * @param {module:system.System} system Parent system reference.
     * @param {string} relativePath Path, relative to the system root.
     * @param {promiseCallback} callback Will call back with a promise.
     */
    constructor(system, relativePath, callback) {
        // Set system for instance
        this.system = system;
        // Initialize instance with what can be set
        let parsed = path.parse(relativePath);
        this.name = parsed.name;
        this.dir = parsed.dir;
        this.type = "undefined";
        // A promise to be passed to the callback
        var done = async () => {
            let { rootDir } = system.system;
            let fullPath = loader.join(rootDir, this.dir, this.name);
            let isFile, isDir;
            // Determine if it is a file or folder
            let isFilePromise = loader.isFile(fullPath).then(function (result) {
                isFile = result;
            });
            let isDirPromise = loader.isDir(fullPath).then(function (result) {
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
