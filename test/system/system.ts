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

const nonExistentFileOrDir = "Non-existent file or directory";

/** System test unit initialization data. */
export interface SystemTest {
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
		/**
		 * Tests constructor for the following.
		 *
		 * - Should still execute with inappropriate options and no ways to report an error
		 * - Should execute with inappropriate options and error reporting not being a function
		 * - Should fail with inappropriate options
		 * - Should fail with no events or behaviors files
		 * - Should report functionality_error with fake options
		 * @function constructor
		 * @memberof module:system~test.System
		 */
		describe("constructor", function() {
			it("should still execute with inappropriate options and no ways to report an error", function() {
				new System({} as {
					behaviors: Array<{
						[key: string]: {
							(that: System): void;
						};
					}> | null;
					onError: ErrorCallback | null;
					options: Options;
				}); /* eslint-disable-line no-new */ // "new System" is only used for side-effects of testing
			});
			it("should execute with inappropriate options and error reporting not being a function", function() {
				new System({
					options: (null as unknown) as Options,
					behaviors: null,
					onError: ("notFunction" as unknown) as ErrorCallback
				} as {
					behaviors: Array<{
						[key: string]: {
							(that: System): void;
						};
					}> | null;
					onError: ErrorCallback | null;
					options: Options;
				}); /* eslint-disable-line no-new */ // "new System" is only used for side-effects of testing
			});
			it("should fail with inappropriate options", function(done) {
				new System({
					options: (null as unknown) as Options,
					behaviors: null,
					onError: function(error: any) {
						/* eslint-disable-line no-new */ // "new System" is only used for side-effects of testing
						assert.strictEqual(error.code, "system_options_failure");
						assert.strictEqual(error.message, "The options provided to the system constructor are inconsistent.");
						done();
					}
				});
			});
			it("should fail with no events or behaviors files", function(done: any) {
				let options = {
					id: "cities",
					rootDir: "test",
					relativeInitDir: "cities",
					initFilename: "init",
					logging: "off"
				};

				new System({
					options: options,
					behaviors: null,
					onError: function(err: any) {
						/* eslint-disable-line no-new */ // "new System" is only used for side-effects of testing
						assert.throws(
							function() {
								throw err;
							},
							function(error: any) {
								return error instanceof loaderError.LoaderError && error.code === "loader_fail";
							}
						);
						done();
					}
				});
			});
			it("should report functionality_error with fake options", function(done: any) {
				let options = {
					id: "fakeID",
					rootDir: "fakeRoot",
					relativeInitDir: "fakeDir",
					initFilename: "fakeInit",
					logging: "off"
				};

				new System({
					options: options,
					behaviors: null,
					onError: function(err: any) {
						/* eslint-disable-line no-new */ // "new System" is only used for side-effects of testing
						assert.throws(
							function() {
								throw err;
							},
							function(error: any) {
								return err instanceof loaderError.LoaderError && error.code === "functionality_error";
							}
						);
						done();
					}
				});
			});
			/**
			 * Post-instance initialization error tests.
			 *
			 * - Should not generate inappropriately defined errors
			 * - Should generate the default message
			 */
			describe("errorInitialization", function() {
				let options = {
					id: "errorInitializationCheck",
					rootDir: "test",
					relativeInitDir: "error_initialization_check",
					initFilename: "init",
					logging: "off"
				};
				let systemErrors = [
					{
						error: "no_message",
						description: "no error message"
					},
					{
						error: "empty_message",
						description: "empty message"
					},
					{
						error: "message_not_a_string",
						description: "message not a string"
					}
				];
				let systemTest: any;
				before(function(done) {
					systemTest = new System({
						options,
						behaviors: [
							{
								system_load() {
									done();
								}
							}
						],
						onError(error: loaderError.LoaderError): void {
							done();
							throw error;
						}
					});
				});
				it("should not generate inappropriately defined errors", function() {
					assert.strictEqual(systemTest.private.error.hasOwnProperty("not_object"), false);
				});
				for (let error of systemErrors) {
					it("should generate the default message with " + error.description, function() {
						assert.strictEqual(systemTest.private.error[error.error].message, "Error message not set.");
					});
				}
			});
		});

		// Array of testing unit initialization data
		const systems = [
			{
				// Example
				options: {
					id: "example",
					rootDir: "test",
					relativeInitDir: "example",
					initFilename: "init",
					logging: "console" // Test console logging
				},
				rawInitFilename: "init.yml",
				initYamlContents: expected.exampleYamlInit,
				initContents: expected.exampleInit,
				initDirFileAmount: 4,
				initDirFolderAmount: 1
			},
			{
				// Options without system arguments
				options: {
					id: "options-no-args",
					rootDir: "test",
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
					rootDir: "test",
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
					rootDir: "test",
					relativeInitDir: "flowerShop",
					initFilename: "init",
					logging: "off"
				},
				rawInitFilename: "init.yml",
				initYamlContents: expected.flowerShopYamlInit,
				initContents: expected.flowerShopInit,
				initDirFileAmount: 6,
				initDirFolderAmount: 2,
				error: {
					errorInstances: ["all_flowers_gone"],
					stringErrors: ["carShopError"]
				},
				behaviorTest: true,
				checkSubsystemVars: { "local-fs": { a: "b", homepage: "https://github.com/cpuabuse/node-system" } }
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
							if (Object.prototype.hasOwnProperty.call(element, "checkSubsystemVars")) {
								Object.keys(element.checkSubsystemVars as object).forEach(function(key: string): void {
									let subsystemVars: any = systemTest.private.subsystem[key].files;
									assert.deepStrictEqual(subsystemVars, (element.checkSubsystemVars as any)[key] as object);
								});
							}
						});
					});

					/**
					 * Tests static log function.
					 * Inevitably produces console output.
					 * @function log
					 * @memberof module:system~test.System
					 */
					describe(".testLog()", function(): void {
						it("should print a test message to console", function(): void {
							systemTest.testLog("Test");
						});
					});

					/**
					 * Tests static error function.
					 * Inevitably produces console output.
					 * @function error
					 * @memberof module:system~test.System
					 */
					describe(".testError()", function(): void {
						it("should print a test error message to console", function(): void {
							systemTest.testError("Test");
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
											.getFile(element.options.relativeInitDir, element.rawInitFilename)
											.then(function(result: any) {
												assert.strictEqual(result.toString(), element.initContents);
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
										systemTest.private.file
											.getFile(element.options.relativeInitDir, element.rawInitFilename)
											.then(function(result: any) {
												assert.strictEqual(result.toString(), element.initContents);
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
											.getFile(element.options.relativeInitDir, nonExistentFileOrDir)
											.catch(function(error: any) {
												assert.strictEqual(error, systemTest.private.error.file_system_error);
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
												assert.strictEqual(error, systemTest.private.error.file_system_error);
												done();
											});
									}
								);
							});
							describe(".list()", function(): void {
								let both = element.initDirFileAmount + element.initDirFolderAmount; // Expected amount of files and folders
								it(`should be ${element.initDirFileAmount} with args ("${element.options.relativeInitDir}", isFile())`, function(done: () => void): void {
									systemTest.private.file
										.list(element.options.relativeInitDir, systemTest.private.file.filter.isFile)
										.then(function(result: Array<string>): void {
											assert.strictEqual(result.length, element.initDirFileAmount);
											done();
										});
								});
								it(`should be ${element.initDirFileAmount} with args ("${element.options.relativeInitDir}", isDir())`, function(done: () => void): void {
									systemTest.private.file
										.list(element.options.relativeInitDir, systemTest.private.file.filter.isDir)
										.then(function(result: Array<string>): void {
											assert.strictEqual(result.length, element.initDirFolderAmount);
											done();
										});
								});
								it(`should be ${both} with args ("${element.options.relativeInitDir}", null)`, function(done) {
									systemTest.private.file.list(element.options.relativeInitDir, null).then(function(result: any): void {
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
											.toAbsolute("." + path.sep, element.options.relativeInitDir)
											.then(function(result: any) {
												assert.strictEqual(
													result,
													element.options.rootDir + path.sep + element.options.relativeInitDir
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
											element.options.relativeInitDir + path.sep + element.rawInitFilename
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
													if (systemError.SystemError.isSystemError(systemTest.private.error[error])) {
														done();
													}
												});
												it('should have code equal to "' + error + '"', function() {
													assert.throws(
														function() {
															throw systemTest.private.error[error];
														},
														{
															code: error
														}
													);
												});
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
													if (!systemError.SystemError.isSystemError((error as unknown) as systemError.SystemError)) {
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
								systemTest.fire("name_does_not_exist", "An event that does not exist has been fired.");
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
										systemTest
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
										systemTest.addBehaviors("not_a_behavior");
									});
									it("should fire behavior_attach_request_fail with an empty array as an argument", function(done) {
										systemTest.done = function() {
											done();
										};
										systemTest.addBehaviors([]);
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
					assert.strictEqual(checkOptionsFailure(options.options as Options), true);
				});
			});
		});
	});
}

module.exports = {
	testSystem
};
