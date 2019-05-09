// test.js
/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
*/
"use strict";

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */
/* global before:true */

const system = require("../src/system.js");
const systemError = require("../src/error.js");
const loaderError = require("../src/loaderError.js");
const expected = require("./expected.js");
const assert = require("assert");
const path = require("path");
const nonExistentFileOrDir = "Non-existent file or directory";

/**
 * Tests of System class.
 * @member System
 * @memberof module:system~test
 */
function testSystem(){
	describe("System", function() {
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
		describe("constructor", function(){
			it("should still execute with inappropriate options and no ways to report an error", function(){
				new system.System(); /* eslint-disable-line no-new */// "new System" is only used for side-effects of testing
			});
			it("should execute with inappropriate options and error reporting not being a function", function(){
				new system.System(null, null, "notFunction"); /* eslint-disable-line no-new */// "new System" is only used for side-effects of testing
			});
			it("should fail with inappropriate options", function(done){
					new system.System(null, null, function(error){ /* eslint-disable-line no-new */// "new System" is only used for side-effects of testing
						assert.strictEqual(error.code, "system_options_failure");
						assert.strictEqual(error.message, "The options provided to the system constructor are inconsistent.");
						done();
					});
			});
			it("should fail with no events or behaviors files", function(done){
				let options = {
					id: "cities",
					rootDir: "test",
					relativeInitDir: "cities",
					initFilename: "init",
					logging: "off"
				};

				new system.System(options, null, function(err){ /* eslint-disable-line no-new */// "new System" is only used for side-effects of testing
					assert.throws(
						function(){
							throw err;
						},
						function(error){
							return ((error instanceof loaderError.LoaderError) && error.code === "loader_fail");
						}
					);
					done();
				});
			});
			it("should report functionality_error with fake options", function(done){
				let options = {
					id: "fakeID",
					rootDir: "fakeRoot",
					relativeInitDir: "fakeDir",
					initFilename: "fakeInit",
					logging: "off"
				};

				new system.System(options, null, function(err){ /* eslint-disable-line no-new */// "new System" is only used for side-effects of testing
					assert.throws(
						function(){
							throw err;
						},
						function(error){
							return ((err instanceof loaderError.LoaderError) && error.code === "functionality_error");
						}
					);
					done();
				});
			});
			/**
			 * Post-instance initialization error tests.
			 *
			 * - Should not generate inappropriately defined errors
			 * - Should generate the default message
			 * @function errorInitialization
			 * @memberof module:system~test.System.constructor
			 */
			describe("errorInitialization", function(){
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
				let systemTest;
				before(function(done){
					systemTest = new system.System(
						options,
						[
							{
								"system_load" (){
									done();
								}
							}
						]
					);
				});
				it("should not generate inappropriately defined errors", function(){
					assert.strictEqual(systemTest.system.error.hasOwnProperty("not_object"), false);
				});
				for (let error of systemErrors){
					it("should generate the default message with " + error.description, function(){
						assert.strictEqual(systemTest.system.error[error.error].message, "Error message not set.");
					});
				}
			});
		});

		// Array of testing unit initialization data
		const systems = [
			{ // Example
				options: {
					id: "example",
					rootDir: "test",
					relativeInitDir: "example",
					initFilename: "init",
					logging: "off"
				},
				rawInitFilename: "init.yml",
				initContents: expected.exampleInit,
				rootDirFileAmount: 7,
				rootDirFolderAmount: 7
			},
			{ // Flower shop
				options: {
					id: "flower_shop2",
					rootDir: "test",
					relativeInitDir: "flowerShop",
					initFilename: "init",
					logging: "off"
				},
				rawInitFilename: "init.yml",
				initContents: expected.flowerShopInit,
				rootDirFileAmount: 7,
				rootDirFolderAmount: 7,
				error: {
					errorInstances: ["all_flowers_gone"],
					stringErrors: ["carShopError"]
				},
				behaviorTest: true
			}
		]

		systems.forEach(function(element) {
			describe(element.options.id, function(){
				let systemTest; // Variable for the instance of the System class

				// Promise that will resolve on system_load
				let systemTestLoad = new Promise(function(resolve){
					systemTest = new system.System(
						element.options,
						[
							{
								"system_load": () => {
									resolve();
								}
							}
						]
					);
				});

				before(function(done){
					systemTestLoad.then(function(){
						done();
					});
				});

				// System property of System instance
				describe("#system", function(){
					// System instance ID
					describe("id", function(){
						it("should be " + element.options.id, function(done) {
							assert.strictEqual(systemTest.system.id, element.options.id);
							done();
						});
					});

					/**
					 * Tests the getFile function.
					 * @member getFile
					 * @memberof module:system~test.System
					 */
					describe(".file", function(){
						describe(".getFile()", function(){
							it("should get expected contents from file \"" + element.rawInitFilename + "\" with args (\"" + element.options.relativeInitDir + "\", \"" + element.rawInitFilename + "\")", function(done){
								systemTest.system.file.getFile(element.options.relativeInitDir, element.rawInitFilename).then(function(result){
									assert.strictEqual(result.toString(), element.initContents);
									done();
								});
							});
							it("should instantly get expected file from cache \"" + element.rawInitFilename + "\" with args (\"" + element.options.relativeInitDir + "\", \"" + element.rawInitFilename + "\")", function(done){
								this.timeout(1); /* eslint-disable-line no-invalid-this */
								systemTest.system.file.getFile(element.options.relativeInitDir, element.rawInitFilename).then(function(result){
									assert.strictEqual(result.toString(), element.initContents);
									done();
								});
							});
							it("should produce an error with non-existent args (\"" + element.options.relativeInitDir + "\", \"" + nonExistentFileOrDir + "\")", function(done){
								systemTest.system.file.getFile(element.options.relativeInitDir, nonExistentFileOrDir).catch(function(error){
									assert.strictEqual(error, systemTest.system.error.file_system_error);
									done();
								});
							});
							it("should produce an error with folder args (\"." + path.sep + "\", \"" + element.options.relativeInitDir + "\")", function(done){
								systemTest.system.file.getFile("." + path.sep, element.options.relativeInitDir).catch(function(error){
									assert.strictEqual(error, systemTest.system.error.file_system_error);
									done();
								});
							});
						});
						describe(".list()", function(){
							let both = element.rootDirFileAmount + element.rootDirFolderAmount; // Expected amount of files and folders
							it("should be " + element.rootDirFileAmount + " with args (\"" + path.sep + "\", isFile())", function(done){
								systemTest.system.file.list("." + path.sep, systemTest.system.file.filter.isFile).then(function(result){
									assert.strictEqual(result.length, element.rootDirFileAmount);
									done();
								});
							});
							it("should be " + element.rootDirFolderAmount + " with args (\"." + path.sep + "\", isDir())", function(done){
								systemTest.system.file.list("." + path.sep, systemTest.system.file.filter.isDir).then(function(result){
									assert.strictEqual(result.length, element.rootDirFolderAmount);
									done();
								});
							});
							it("should be " + both + " with args (\"." + path.sep + "\", null)", function(done){
								systemTest.system.file.list("." + path.sep, null).then(function(result){
									assert.strictEqual(result.length, both);
									done();
								});
							});
						});
						describe(".toAbsolute()", function(){
							it("should be equal to \"" + element.options.rootDir + path.sep + element.options.relativeInitDir + "\" with args (\"." + path.sep + "\", \"" + element.options.relativeInitDir + "\")", function(done){
								systemTest.system.file.toAbsolute("." + path.sep, element.options.relativeInitDir).then(function(result){
									assert.strictEqual(result, element.options.rootDir + path.sep + element.options.relativeInitDir);
									done();
								});
							});
						});
						describe(".toRelative()", function(){
							it("should", function(done){
								systemTest.system.file.toRelative(element.options.relativeInitDir, element.options.relativeInitDir + path.sep + element.rawInitFilename).then(function(result){
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
					if(element.hasOwnProperty("error")){
						describe("error", function() {
							if (element.error.hasOwnProperty("errorInstances")){
								describe("errorInstances", function(){
									element.error.errorInstances.forEach(function(error){
										describe(error, function() {
											// It should be a SystemError
											it("should be SystemError", function(done){
												if (systemError.SystemError.isSystemError(systemTest.system.error[error])){
													done();
												}
											});
											it("should have code equal to \"" + error + "\"", function() {
												assert.throws(
													function(){
														throw systemTest.system.error[error];
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

							if (element.error.hasOwnProperty("stringErrors")){
								describe("stringErrors", function(){
									element.error.stringErrors.forEach(function(error){
										describe(error, function(){
											it("should not be SystemError", function(done){
												if(!systemError.SystemError.isSystemError(error)){
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
					describe(".fire()", function(){
						it("should not produce an error, if fired with a name that does not exist", function(){
							systemTest.fire("name_does_not_exist", "An event that does not exist has been fired.");
						});
					});

					if(element.hasOwnProperty("behaviorTest")){
						if(element.behaviorTest){
							/**
							 * Tests the addBehaviors function.
							 * @member addBehaviors
							 * @memberof module:system~test.System
							 */
							describe(".addBehaviors()", function(){
								before(function(done){
									systemTest.addBehaviors([
										{
											"behavior_attach_request_fail"() {
												systemTest.done();
											}
										}
									]).then(function(){
										done();
									});
								});

								it("should fire behavior_attach_request_fail if not provided with an array as an argument", function(done){
									systemTest.done = function(){
										done();
									}
									systemTest.addBehaviors("not_a_behavior");
								});
								it("should fire behavior_attach_request_fail with an empty array as an argument", function(done){
									systemTest.done = function(){
										done();
									}
									systemTest.addBehaviors([]);
								});
							});
						}
					}
				});
			});
		});

		/**
		 * Test the checkOptionsFailure function.
		 * @function checkOptionsFailure
		 * @memberof module:system~test.System
		 */
		describe(".checkOptionsFailure()", function(){
			let optionsArray = [
				{
					errorDescription: "\"logging\" not set",
					options: {
						id: "chickenCoup",
						rootDir: "test",
						relativeInitDir: "chicken_coup",
						initFilename: "init",
						loggingNameError: false
					}
				},
				{
					errorDescription: "\"logging\" not a string",
					options: {
						id: "chickenCoup",
						rootDir: "test",
						relativeInitDir: "chicken_coup",
						initFilename: "init",
						logging: false
					}
				},
				{
					errorDescription: "\"logging\" not a permitted string",
					options: {
						id: "chickenCoup",
						rootDir: "test",
						relativeInitDir: "chicken_coup",
						initFilename: "init",
						logging: "not_included_string"
					}
				},
				{
					errorDescription: "\"id\" not set",
					options: {
						idNameError: "chickenCoup",
						rootDir: "test",
						relativeInitDir: "chicken_coup",
						initFilename: "init",
						logging: "off"
					}
				},
				{
					errorDescription: "\"id\" not string",
					options: {
						id: 123456789,
						rootDir: "test",
						relativeInitDir: "chicken_coup",
						initFilename: "init",
						logging: "off"
					}
				}
			];
			optionsArray.forEach(function(options){
				it("should fail with " + options.errorDescription, function(){
					assert.strictEqual(system.System.checkOptionsFailure(options.options), true);
				});
			});
		});

		/**
		 * Tests static log function.
		 * Inevitably produces console output.
		 * @function log
		 * @memberof module:system~test.System
		 */
		describe(".log()", function(){
			it("should print a test message to console", function(){
				system.System.log("Test");
			});
		});

		/**
		 * Tests static error function.
		 * Inevitably produces console output.
		 * @function error
		 * @memberof module:system~test.System
		 */
		describe(".error()", function(){
			it("should print a test error message to console", function(){
				system.System.error("Test");
			});
		});
	});
}

module.exports = {
	testSystem
}