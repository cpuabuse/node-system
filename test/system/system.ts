/*
	File: test/system.ts
	cpuabuse.com
*/

/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
 */

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */
/* global before:true */

import * as assert from "assert";
import * as path from "path";
import {
	ErrorCallback /* eslint-disable-line no-unused-vars */,
	Options /* eslint-disable-line no-unused-vars */,
	System,
	checkOptionsFailure
} from "../../src/system/system";
import * as systemError from "../../src/error";
import * as loaderError from "../../src/loaderError";
import * as expected from "../expected";

/** Non-existent file or directory. */
const nonExistentFileOrDir: string = "Non-existent file or directory";

/** Number of retries. */
const retries: number = 3;

/** Test for SystemError. */
interface ErrorTest {
	description: string;
	error: string;
}

/** System test unit initialization data. */
export interface SystemTest {
	/** Name of the behavior subsystem. */
	behaviorSubsystem: string;

	/** Whether behavior test to be done. */
	behaviorTest: true;

	/** Which subsystem vars to check. */
	checkSubsystemVars: {
		[key: string]: any;
	};

	/** Error testing data. */
	error: {
		/** Actual errors. */
		errorInstances: Array<string>;

		/** Errors not to exist. */
		stringErrors: Array<string>;
	};

	/** Contents of the init file as an object. */
	initContents: object;

	/** Yaml contents of the init file as a string. */
	initYamlContents: string;

	/** System init options. */
	options: Options;

	/** Raw init file name. */
	rawInitFilename: string;

	/** Amount of directories in a root directory. */
	rootDirFileAmount: number;

	/** Amount of files in a root directory. */
	rootDirFolderAmount: number;
}

/** Tests of System class. */
export function testSystem(): void {
	describe("System", function(): void {
		// Array of testing unit initialization data
		const systems = [
			{
				// Example
				options: {
					id: "example",
					rootDir: `test${path.sep}data${path.sep}system`,
					relativeInitDir: "example",
					initFilename: "init",
					logging: "console" // Test console logging
				},
				rawInitFilename: "init.yml",
				initYamlContents: expected.exampleYamlInit,
				initContents: expected.exampleInit,
				initDirFileAmount: 3,
				initDirFolderAmount: 1
			},
			{
				// Options without system arguments
				options: {
					id: "options-no-args",
					rootDir: `test${path.sep}data${path.sep}system`,
					relativeInitDir: "options-no-args",
					initFilename: "init",
					logging: "off"
				},
				rawInitFilename: "init.yml",
				initYamlContents: expected.exampleYamlInit,
				initContents: expected.exampleInit,
				initDirFileAmount: 5,
				initDirFolderAmount: 1,
				constructorError: "system_options_failure"
			},
			{
				// Options without system arguments
				options: {
					id: "behavior-no-args",
					rootDir: `test${path.sep}data${path.sep}system`,
					relativeInitDir: "behavior-no-args",
					initFilename: "init",
					logging: "off"
				},
				rawInitFilename: "init.yml",
				initYamlContents: expected.exampleYamlInit,
				initContents: expected.exampleInit,
				initDirFileAmount: 4,
				initDirFolderAmount: 1,
				constructorError: "system_options_failure"
			},
			{
				// Flower shop
				options: {
					id: "flower_shop",
					rootDir: `test${path.sep}data${path.sep}system`,
					relativeInitDir: "flowerShop",
					initFilename: "init",
					logging: "off"
				},
				rawInitFilename: "init.yml",
				initYamlContents: expected.flowerShopYamlInit,
				initContents: expected.flowerShopInit,
				initDirFileAmount: 5,
				initDirFolderAmount: 2,
				error: {
					errorInstances: ["all_flowers_gone"],
					stringErrors: ["carShopError"]
				},
				behaviorTest: true,
				behaviorSubsystem: "strange_behavior_name",
				checkSubsystemVars: {
					"local-fs": {
						a: "b",
						homepage: "https://github.com/cpuabuse/node-system"
					}
				}
			}
		];

		systems.forEach(function(element) {
			describe(element.options.id, function(): void {
				let systemTest: any; // Variable for the instance of the System class
				let constructorError: loaderError.LoaderError;
				// Promise that will resolve on system_load
				let systemTestLoad = new Promise(function(resolve) {
					systemTest = new System({
						options: element.options,
						behaviors: [
							{
								system_load: () => {
									resolve();
								}
							}
						],
						onError(error: loaderError.LoaderError): void {
							constructorError = error;
							resolve();
						}
					});
				});

				/* Before */
				before(function(done: () => void): void {
					systemTestLoad.then(function(): void {
						done();
					});
				});

				if (element.constructorError === undefined) {
					describe("constructor", function(): void {
						it("should not execute onError callback", function(): void {
							assert.equal(constructorError, undefined);
						});
					});

					/** Test getYaml function. */
					describe(".getYaml()", function(): void {
						it("should read correct YAML", function(): void {
							let promise: Promise<string> = systemTest.private.file.getYaml(
								element.options.relativeInitDir,
								element.options.initFilename
							);
							promise.then(function(result: string): void {
								assert.deepStrictEqual(result, element.initYamlContents);
							});
						});
					});

					describe(".subsystem", function(): void {
						it("should initialise the sub-system", function(): void {
							if (
								Object.prototype.hasOwnProperty.call(
									element,
									"checkSubsystemVars"
								)
							) {
								Object.keys(element.checkSubsystemVars as object).forEach(
									function(key: string): void {
										let subsystemVars: any =
											systemTest.private.subsystem[key].files;
										assert.deepStrictEqual(
											subsystemVars,
											(element.checkSubsystemVars as any)[key] as object
										);
									}
								);
							}
						});
					});

					// System property of System instance
					describe("#system", function() {
						/**
						 * Tests the getFile function.
						 * @member getFile
						 * @memberof module:system~test.System
						 */
						describe(".file", function() {
							describe(".getFile()", function() {
								it(
									'should get expected contents from file "' +
										element.rawInitFilename +
										'" with args ("' +
										element.options.relativeInitDir +
										'", "' +
										element.rawInitFilename +
										'")',
									function(done: any) {
										systemTest.private.file
											.getFile(
												element.options.relativeInitDir,
												element.rawInitFilename
											)
											.then(function(result: any) {
												assert.strictEqual(
													result.toString(),
													element.initContents
												);
												done();
											});
									}
								);
								it(
									'should instantly get expected file from cache "' +
										element.rawInitFilename +
										'" with args ("' +
										element.options.relativeInitDir +
										'", "' +
										element.rawInitFilename +
										'")',
									function(done: any) {
										this.timeout(1); /* eslint-disable-line no-invalid-this */
										this.retries(retries);
										systemTest.private.file
											.getFile(
												element.options.relativeInitDir,
												element.rawInitFilename
											)
											.then(function(result: any) {
												assert.strictEqual(
													result.toString(),
													element.initContents
												);
												done();
											});
									}
								);
								it(
									'should produce an error with non-existent args ("' +
										element.options.relativeInitDir +
										'", "' +
										nonExistentFileOrDir +
										'")',
									function(done) {
										systemTest.private.file
											.getFile(
												element.options.relativeInitDir,
												nonExistentFileOrDir
											)
											.catch(function(error: any) {
												assert.strictEqual(
													error,
													systemTest.private.error.file_system_error
												);
												done();
											});
									}
								);
								it(
									'should produce an error with folder args (".' +
										path.sep +
										'", "' +
										element.options.relativeInitDir +
										'")',
									function(done) {
										systemTest.private.file
											.getFile("." + path.sep, element.options.relativeInitDir)
											.catch(function(error: any) {
												assert.strictEqual(
													error,
													systemTest.private.error.file_system_error
												);
												done();
											});
									}
								);
							});
							describe(".list()", function(): void {
								let both =
									element.initDirFileAmount + element.initDirFolderAmount; // Expected amount of files and folders
								it(`should be ${element.initDirFileAmount} with args ("${element.options.relativeInitDir}", isFile())`, function(done: () => void): void {
									systemTest.private.file
										.list(
											element.options.relativeInitDir,
											systemTest.private.file.filter.isFile
										)
										.then(function(result: Array<string>): void {
											assert.strictEqual(
												result.length,
												element.initDirFileAmount
											);
											done();
										});
								});
								it(`should be ${element.initDirFileAmount} with args ("${element.options.relativeInitDir}", isDir())`, function(done: () => void): void {
									systemTest.private.file
										.list(
											element.options.relativeInitDir,
											systemTest.private.file.filter.isDir
										)
										.then(function(result: Array<string>): void {
											assert.strictEqual(
												result.length,
												element.initDirFolderAmount
											);
											done();
										});
								});
								it(`should be ${both} with args ("${element.options.relativeInitDir}", null)`, function(done) {
									systemTest.private.file
										.list(element.options.relativeInitDir, null)
										.then(function(result: any): void {
											assert.strictEqual(result.length, both);
											done();
										});
								});
							});
							describe(".toAbsolute()", function() {
								it(
									'should be equal to "' +
										element.options.rootDir +
										path.sep +
										element.options.relativeInitDir +
										'" with args (".' +
										path.sep +
										'", "' +
										element.options.relativeInitDir +
										'")',
									function(done) {
										systemTest.private.file
											.toAbsolute(
												"." + path.sep,
												element.options.relativeInitDir
											)
											.then(function(result: any) {
												assert.strictEqual(
													result,
													element.options.rootDir +
														path.sep +
														element.options.relativeInitDir
												);
												done();
											});
									}
								);
							});
							describe(".toRelative()", function() {
								it("should", function(done: any) {
									systemTest.private.file
										.toRelative(
											element.options.relativeInitDir,
											element.options.relativeInitDir +
												path.sep +
												element.rawInitFilename
										)
										.then(function(result: any) {
											assert.strictEqual(result, element.rawInitFilename);
											done();
										});
								});
							});
						});

						/*
							Perform test only on units that have the error property.
							Iterate through "errorInstances" array, if present, and check that respective errors are indeed of type SystemError.
							Iterate through "stringErrors" array, if present, and check that respective errors are not of type SystemError.
						*/
						if (element.hasOwnProperty("error")) {
							describe("error", function() {
								// @ts-ignore
								if (element.error.hasOwnProperty("errorInstances")) {
									describe("errorInstances", function() {
										// @ts-ignore
										element.error.errorInstances.forEach(function(error) {
											describe(error, function() {
												// It should be a SystemError
												it("should be SystemError", function(done: any) {
													if (
														systemError.SystemError.isSystemError(
															systemTest.private.error[error]
														)
													) {
														done();
													}
												});
												it(
													'should have code equal to "' + error + '"',
													function() {
														assert.throws(
															function() {
																throw systemTest.private.error[error];
															},
															{
																code: error
															}
														);
													}
												);
											});
										});
									});
								}

								// @ts-ignore
								if (element.error.hasOwnProperty("stringErrors")) {
									describe("stringErrors", function() {
										// @ts-ignore
										element.error.stringErrors.forEach(function(error) {
											describe(error, function() {
												it("should not be SystemError", function(done: any) {
													if (
														!systemError.SystemError.isSystemError(
															(error as unknown) as systemError.SystemError
														)
													) {
														done();
													}
												});
											});
										});
									});
								}
							});
						}

						/**
						 * Tests the fire function.
						 * @member fire
						 * @memberof module:system~test.System
						 */
						describe(".fire()", function() {
							it("should not produce an error, if fired with a name that does not exist", function() {
								// TODO: Move to behavior subsystem
								systemTest.public.subsystem[
									element.behaviorSubsystem === undefined
										? "behavior"
										: element.behaviorSubsystem
								].call.fire(
									"name_does_not_exist",
									"An event that does not exist has been fired."
								);
							});
						});

						if (element.hasOwnProperty("behaviorTest")) {
							if (element.behaviorTest) {
								/**
								 * Tests the addBehaviors function.
								 * @member addBehaviors
								 * @memberof module:system~test.System
								 */
								describe(".addBehaviors()", function() {
									before(function(done) {
										systemTest.public.subsystem[
											element.behaviorSubsystem === undefined
												? "behavior"
												: element.behaviorSubsystem
										].call
											.addBehaviors([
												{
													behavior_attach_request_fail() {
														systemTest.done();
													}
												}
											])
											.then(function() {
												done();
											});
									});

									it("should fire behavior_attach_request_fail if not provided with an array as an argument", function(done) {
										systemTest.done = function() {
											done();
										};
										systemTest.public.subsystem[
											element.behaviorSubsystem === undefined
												? "behavior"
												: element.behaviorSubsystem
										].call.addBehaviors("not_a_behavior");
									});
									it("should fire behavior_attach_request_fail with an empty array as an argument", function(done) {
										systemTest.done = function() {
											done();
										};
										systemTest.public.subsystem[
											element.behaviorSubsystem === undefined
												? "behavior"
												: element.behaviorSubsystem
										].call.addBehaviors([]);
									});
								});
							}
						}
					});
				} else {
					describe("constructor", function(): void {
						it("should execute onError callback", function(): void {
							assert.equal(constructorError.code, element.constructorError);
						});
					});
				}
			});
		});

		/**
		 * Test the checkOptionsFailure function.
		 * @function checkOptionsFailure
		 * @memberof module:system~test.System
		 */
		describe(".checkOptionsFailure()", function() {
			let optionsArray = [
				{
					errorDescription: '"logging" not set',
					options: {
						id: "chickenCoup",
						rootDir: "test",
						relativeInitDir: "chicken_coup",
						initFilename: "init",
						loggingNameError: false
					}
				},
				{
					errorDescription: '"logging" not a string',
					options: {
						id: "chickenCoup",
						rootDir: "test",
						relativeInitDir: "chicken_coup",
						initFilename: "init",
						logging: false
					}
				},
				{
					errorDescription: '"logging" not a permitted string',
					options: {
						id: "chickenCoup",
						rootDir: "test",
						relativeInitDir: "chicken_coup",
						initFilename: "init",
						logging: "not_included_string"
					}
				},
				{
					errorDescription: '"id" not set',
					options: {
						idNameError: "chickenCoup",
						rootDir: "test",
						relativeInitDir: "chicken_coup",
						initFilename: "init",
						logging: "off"
					}
				},
				{
					errorDescription: '"id" not string',
					options: {
						id: 123456789,
						rootDir: "test",
						relativeInitDir: "chicken_coup",
						initFilename: "init",
						logging: "off"
					}
				}
			];
			optionsArray.forEach(function(options) {
				it("should fail with " + options.errorDescription, function() {
					assert.strictEqual(
						checkOptionsFailure(options.options as Options),
						true
					);
				});
			});
		});
	});
}
