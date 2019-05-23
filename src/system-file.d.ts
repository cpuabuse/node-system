declare const loader: any;
declare const path: any;
/**
 * System-lvel abstraction of a file.
 * FsObject stands for "File System Object".
 * @inner
 * @memberof module:system
 */
declare class FsObject {
    /**
     * Creates an instance of FsObject.
     * @param {module:system.System} system Parent system reference.
     * @param {string} relativePath Path, relative to the system root.
     * @param {promiseCallback} callback Will call back with a promise.
     */
    constructor(system: any, relativePath: any, callback: any);
    readonly base: any;
    readonly path: any;
}
