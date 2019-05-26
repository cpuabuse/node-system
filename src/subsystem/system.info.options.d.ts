declare const Info: any;
declare class Options extends Info {
    constructor(systemArgs: any, constructorArgs: any, ...subsystemArgs: any[]);
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
declare function checkOptionsFailure(options: any): boolean;
