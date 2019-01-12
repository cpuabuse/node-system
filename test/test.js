// test.js
/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
*/
"use strict";

/**
 * Series of tests for the system.
 * @inner
 * @member test
 * @memberof module:system
 */

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */
/* global before:true */

const system = require("../src/system.js");
const systemError = require("../src/error.js");
const loader = require("../src/loader.js");
const expected = require("./expected.js");
const assert = require("assert");
const path = require("path");
const waitTime = 200;
const nonExistentFileOrDir = "Non-existent file or directory";


// DEBUG: Devonly - promise throw
process.on("unhandledRejection", up => {
	throw up
});

/**
 * Tests for the Loader class.
 * @member dummyErrorHandler
 * @memberof module:system~test
 */
function dummyErrorHandler(error){} /* eslint-disable-line no-unused-vars *//* eslint-disable-line no-empty-function */// Want to emphasize the error argument without actually using it and dummy is best empty

/**
 * Tests for the Loader class.
 * @member Loader
 * @memberof module:system~test
 */
describe("Loader", function() {
	var loaders = [
		// Stars
		{
			name: "Stars",
			rootDir: "test",
			dir: "stars",
			file: "stars",
			rawFilename: "stars.yml",
			filesAndFoldersAmount: 3,
			grandChildrenCompare: [
				{
					child: "sol",
					grandChild: "planet2",
					value: "Earth"
				},
				{
					child: "sol",
					grandChild: "planet3",
					value: "Mars"
				}
			]
		},
		// Flower Shop
		{
			name: "Flower Shop",
			rootDir: "test",
			dir: "flowerShop",
			file: "init",
			rawFilename: "init.yml",
			filesAndFoldersAmount: 7,
			greatGrandChildrenCompare: [
				{
					child: "branch",
					grandChild: "branch_stock",
					greatGrandChild: "potatoes",
					value: "17"
				},
				{
					child: "branch",
					grandChild: "branch_stock",
					greatGrandChild: "cabbages",
					value: "87"
				},
				{
					child: "branch",
					grandChild: "branch_stock",
					greatGrandChild: "oranges",
					value: "49"
				},
				{
					child: "branch",
					grandChild: "branch_stock",
					greatGrandChild: "pineapples",
					value: "16"
				},
				{
					child: "branch",
					grandChild: "branch_stock",
					greatGrandChild: "carrots",
					value: "50"
				}
			]
		},
		// Example
		{
			name: "Example",
			rootDir: "test",
			dir: "example",
			file: "init",
			rawFilename: "init.yml",
			filesAndFoldersAmount: 4
		}
	];
	loaders.forEach(function(element){
		describe(".yamlToObject()", function(){
			let data = "Wine: Red";
			let expectedResults = {
				Wine: "Red"
			};
			it("should produce JSON", function(){
				assert.deepEqual(loader.Loader.yamlToObject(data), expectedResults);
			});
		});

		describe(element.name, function(){
			let loaderTest;
			let load = new Promise(function(resolve){
				loaderTest = new loader.Loader(element.rootDir, element.dir, element.file, load => {
					load.then(() => {
						resolve();
					});
				});
			});

			if(element.hasOwnProperty("grandChildrenCompare")){
				if(element.grandChildrenCompare.length > 0){
					element.grandChildrenCompare.forEach(function(compare){
						describe("#" + compare.child + "." + compare.grandChild, function() {
							it("should be " + compare.value, function(done) {
								load.then(function(){
									assert.equal(loaderTest[compare.child][compare.grandChild], compare.value);
									done();
								});
							});
						});
					});
				}
			}
			if(element.hasOwnProperty("greatGrandChildrenCompare")){
				if(element.greatGrandChildrenCompare.length > 0){
					element.greatGrandChildrenCompare.forEach(function(compare){
						describe("#" + compare.child + "." + compare.grandChild + "." + compare.greatGrandChild, function() {
							it("should be " + compare.value, function(done) {
								load.then(function(){
									assert.equal(loaderTest[compare.child][compare.grandChild][compare.greatGrandChild], compare.value);
									done();
								});
							});
						});
					});
				}
			}

			describe(".list(\"" + element.rootDir + "\", \"" + element.dir + "\")", function(){
				it("should have a length of " + element.filesAndFoldersAmount.toString() + "with args", function(done) {
					loader.Loader.list(element.rootDir, element.dir).then(function(result){
						assert.equal(result.length, element.filesAndFoldersAmount);
						done();
					});
				});
				it("should reject with args", function(done) {
					loader.Loader.list(element.rootDir, "Some text.").then(function(result){
						assert.equal(result.length, element.filesAndFoldersAmount);
					}).catch(function(err){
						dummyErrorHandler(err);
						done();
					});
				});
			});

			/**
			 * Tests the toRelative function with:
			 *
			 * - Single argument
			 * - Array as argument
			 * @member toRelative
			 * @memberof module:system~test.Loader
			 */
			describe(".toRelative()", function(){
				let absolutePath = element.rootDir + path.sep + element.dir; // Absolute path from root
				it("should be equal to \"" + element.dir + "\" with args (\"" + element.rootDir + "\", \"" + absolutePath + "\")", function(){
					assert.equal(loader.Loader.toRelative(element.rootDir, absolutePath), element.dir);
				});
				it("should work with array", function(){
					assert.deepEqual(loader.Loader.toRelative(element.rootDir, [absolutePath, absolutePath]), [element.dir, element.dir]);
				});
			});

			/**
			 * Tests the join function with:
			 *
			 * - Single argument
			 * - Array as argument
			 * @member join
			 * @memberof module:system~test.Loader
			 */
			describe(".join(\"" + element.rootDir + "\", \"" + element.dir + "\")", function(){
				let expectedPath = element.rootDir + path.sep + element.dir;
				it("should be equal to " + expectedPath, function(){
					assert.equal(loader.Loader.join(element.rootDir, element.dir), expectedPath);
				});
				it("should work with array", function(){
					assert.deepEqual(loader.Loader.join(element.rootDir, [element.dir, element.dir]), [expectedPath, expectedPath]);
				});
			});

			/**
			 * Tests the isFile function.
			 * @member isFile
			 * @memberof module:system~test.Loader
			 */
			describe(".isFile(\"" + element.rootDir + "\", \"" + element.dir + "\", \"" + element.rawFilename + "\")", function(){
				let isFile = loader.Loader.isFile(element.rootDir, element.dir, element.rawFilename);
				it("should be a file", function(done){
					isFile.then(function(result){
						assert.equal(result, true);
						done();
					});
				});
				it("FILE should not be a directory with args (\"" + element.rootDir + "\", \"" + element.dir + path.sep + element.rawFilename + "\")", function(done){
					loader.Loader.isFile(element.rootDir, "./" ,element.dir).then(function(result){
						assert.equal(result, false);
						done();
					});
				});
				it("FILE should not be a directory with args (\"" + element.rootDir + "\", \"" + nonExistentFileOrDir + "\")", function(done){
					loader.Loader.isFile(element.rootDir, "./", nonExistentFileOrDir).then(function(result){
						assert.equal(result, false);
						done();
					});
				});
			});

			/**
			 * Tests the isDir function with:
			 *
			 * - A directory
			 * - A file
			 * - A non-existant directory
			 * @member isDir
			 * @memberof module:system~test.Loader
			 */
			describe(".isDir()" , function(){
				it("should be a directory with args (\"" + element.rootDir + "\", \"" + element.dir + "\")", function(done){
					loader.Loader.isDir(element.rootDir, element.dir).then(function(result){
						assert.equal(result, true);
						done();
					});
				});

				it("should not be a directory with args (\"" + element.rootDir + "\", \"" + element.dir + path.sep + element.rawFilename + "\")", function(done){
					loader.Loader.isDir(element.rootDir, loader.Loader.join(element.dir, element.rawFilename)).then(function(result){
						assert.equal(result, false);
						done();
					});
				});

				it("should not be a directory with args (\"" + element.rootDir + "\", \"" + nonExistentFileOrDir + "\")", function(done){
					loader.Loader.isDir(element.rootDir, nonExistentFileOrDir).then(function(result){
						assert.equal(result, false);
						done();
					});
				});
			});
		});
	});
});

/**
 * Tests of System class.
 * @member System
 * @memberof module:system~test
 */
describe("System", function() {
	describe("constructor", function(){
		it("should fail with inappropriate options", function(done){
				new system.System(null, null, function(error){ /* eslint-disable-line no-new */// "new System" is only used for side-effects of testing
					assert.equal(error.code, "system_options_failure");
					assert.equal(error.message, "The options provided to the system constructor are inconsistent.");
					done();
				});
		});
	});
	it("should fail with no events or behaviors files", function(done){
		let options = {
			id: "cities",
			rootDir: "./test",
			relativeInitDir: "cities",
			initFilename: "init",
			notMute: false
		};

		new Promise(function(resolve, reject){
			new system.System(options, null, function(err){ /* eslint-disable-line no-new */// "new System" is only used for side-effects of testing
				reject(err);
			});
		}).catch(function(error){
			assert.equal(error, "loader_fail");
			done();
		});
	});
	// Array of testing unit initialization data
	var systems = [
		{ // Example
			options: {
				id: "example",
				rootDir: "./test",
				relativeInitDir: "example",
				initFilename: "init",
				notMute: false
			},
			rawInitFilename: "init.yml",
			initContents: expected.exampleInit
		},
		{ // Flower shop
			options: {
				id: "flower_shop2",
				rootDir: "./test",
				relativeInitDir: "flowerShop",
				initFilename: "init",
				notMute: false
			},
			rawInitFilename: "init.yml",
			initContents: expected.flowerShopInit,
			error: {
				errorInstances: ["all_flowers_gone"],
				stringErrors: ["carShopError"]
			}
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
						assert.equal(systemTest.system.id, element.options.id);
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
								assert.equal(result, element.initContents);
								done();
							});
						});
						it("should produce an error with non-existent args (\"" + element.options.relativeInitDir + "\", \"" + nonExistentFileOrDir + "\")", function(done){
							systemTest.system.file.getFile(element.options.relativeInitDir, nonExistentFileOrDir).catch(function(error){
								assert.equal(error, systemTest.system.error.file_system_error);
								done();
							});
						});
						it("should produce an error with folder args (\"./\", \"" + element.options.relativeInitDir + "\")", function(done){
							systemTest.system.file.getFile("./", element.options.relativeInitDir).catch(function(error){
								assert.equal(error, systemTest.system.error.file_system_error);
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
										it("should be " + error, function(done) {
											try {
												throw systemTest.system.error[error];
											} catch(err){
												assert.equal(err.code, error);
												done();
											}
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
			});

		});
	});
	/**
	 * Test the checkOptionsFailure function.
	 * @member checkOptionsFailure
	 * @memberof module:system~test.System
	 */
	describe(".checkOptionsFailure()", function(){
		let optionsArray = [
			{
				errorDescription: "\"notMute\" not set",
				options: {
					id: "chickenCoup",
					rootDir: "./test",
					relativeInitDir: "chicken_coup",
					initFilename: "init",
					notMuteNameError: false
				}
			},
			{
				errorDescription: "\"notMute\" not boolean",
				options: {
					id: "chickenCoup",
					rootDir: "./test",
					relativeInitDir: "chicken_coup",
					initFilename: "init",
					notMute: "stringFalse"
				}
			},
			{
				errorDescription: "\"id\" not set",
				options: {
					idNameError: "chickenCoup",
					rootDir: "./test",
					relativeInitDir: "chicken_coup",
					initFilename: "init",
					notMute: false
				}
			},
			{
				errorDescription: "\"id\" not string",
				options: {
					id: 123456789,
					rootDir: "./test",
					relativeInitDir: "chicken_coup",
					initFilename: "init",
					notMute: false
				}
			}
		];
		optionsArray.forEach(function(options){
			it("should fail with " + options.errorDescription, function(){
				assert.equal(system.System.checkOptionsFailure(options.options), true);
			});
		});
	});
});

describe("AtomicLock", function() {
	// Assing variables
	let atomicLock = new system.AtomicLock();

	describe("initial state", function(){
		it("should be unlocked", function(){
			assert.equal(atomicLock.locked, false);
		});
	});

	describe("locked state", function(){
		it("should be locked", function(done){
			atomicLock.lock().then(function(){
				assert.equal(atomicLock.locked, true);
				done();
			});
		});
	});

	describe("lock while locked", function(){
		it("should lock after timed release", function(done){
			setTimeout(function(){
				atomicLock.release();
			}, waitTime);
			atomicLock.lock().then(() => done());
			assert.equal(atomicLock.locked, true);
		})
	})
});