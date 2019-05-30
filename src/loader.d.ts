/// <reference types="node" />
/**
 * Constructor callback.
 * @param done Fullfills when constructor finishes execution
 */
export declare type ConstructorCallback = (done: Promise<void>) => void;
/** Required by system to perform file initialization. */
export declare class Loader {
    /**
     * @param rootDir Absolute root directory.
     * @param relativeInitDir Relative path to root.
     * @param initFilename Filename.
     * @param callback Callback to call with Promise of completion.
     * @throws [[LoaderError]] Will throw `unexpected_constructor`
     */
    constructor(rootDir: string, arg_relativeInitDir: string, arg_initFilename: string, callback: ConstructorCallback);
    /**
     * Gets file contents.
     *
     * **Usage**
     *
     * ```typescript
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
     * ```
     * @param rootDir Absolute root directory.
     * @param relativeDir Directory relative to root.
     * @param file Full file name.
     * @returns File contents.
     */
    static getFile(rootDir: string, relativeDir: string, file: string): Promise<Buffer>;
    /**
     * Extracts relative path from rootDir to target.
     *
     * **Usage**
     *
     * ```typescript
     * // Convert path and output the result
     * console.log(Loader.toRelative("c:\machines\refrigerators", "c:\machines\appliances"));
     *
     * // Output
     * // ..\appliances
     * ```
     * @param dir Source folder.
     * @param target File/folder name|names.
     * @returns Relative path|paths.
     */
    static toRelative(dir: string, target: string | Array<string>): string | Array<string>;
    /**
     * Join a root directory with a file/folder or an array of files/folders to absolute path.
     *
     * **Usage**
     *
     * ```typescript
     * // Join and log result
     * console.log(Loader.join("c:\machines", "appliances"))
     *
     * // Output
     * // c:\machines\appliances
     * ```
     * @param pathArrays File/folder name|names.
     * @returns Absolute path|paths.
     */
    static join(...pathArrays: Array<string | Array<string>>): string | Array<string>;
    /**
     * Checks if is a file
     *
     * **Usage**
     *
     * ```typescript
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
     * ```
     * @param rawPath Full filepath.
     * @returns Returns `true` if a file, `false` if not.
     */
    static isFile(rawPath: string): Promise<boolean>;
    /**
     * Checks if is a directory.
     *
     * **Usage**
     *
     * ```typescript
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
     * ```
     * @param rootDir Absolute root directory.
     * @param relativeDir Relative directory to root.
     * @returns Returns `true` if a directory, `false` if not.
     */
    static isDir(rootDir: string, relativeDir: string): Promise<boolean>;
    /**
     * Returns an array of strings, representing the contents of a folder.
     *
     * **Usage**
     *
     * ```typescript
     * // List directory contents
     * Loader.list("c:","machines").then(function(result){
     *   console.log(result);
     * }, function(error){
     *   console.error("Folder not found.");
     * });
     *
     * // Output
     * // ["machines", "appliances"]
     * ```
     * @param rootDir Root directory.
     * @param relativeDir Relative directory.
     * @returns Array with contents; Rejects with errors from [fs.readdir](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback).
     */
    static list(rootDir: string, relativeDir: string): Promise<Array<string>>;
    /**
     * Converts YAML string to a JS object.
     *
     *  **Usage**
     *
     * ```typescript
     * // Ouput conversion of YAML to JSON
     * console.log(Loader.yamlToObject("Wine: Red"));
     *
     * // Output
     * // {"Wine": "Red"}
     * ```
     * @param string YAML string.
     * @returns Javascript object.
     */
    static yamlToObject(string: string): any;
}
