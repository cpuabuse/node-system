/**
 * Required by system to perform file initialization.
 * @inner
 * @memberof module:system
 */
export declare class Loader {
    /**
     * @param {string} rootDir Absolute root directory.
     * @param {string} relativeInitDir Relative path to root.
     * @param {string} initFilename Filename.
     * @param {function} callback Callback to call with Promise of completion.
     * @throws Will rethrow errors from initRecursion
     */
    constructor(rootDir: any, arg_relativeInitDir: any, arg_initFilename: any, callback: any);
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
    static getFile(rootDir: any, relativeDir: any, file: any): Promise<{}>;
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
    static toRelative(dir: any, target: any): any;
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
    static join(...pathArrays: any[]): any;
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
    static isFile(rawPath: any): Promise<{}>;
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
    static isDir(rootDir: any, relativeDir: any): Promise<{}>;
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
    static list(rootDir: any, relativeDir: any): Promise<{}>;
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
    static yamlToObject(string: any): any;
}
