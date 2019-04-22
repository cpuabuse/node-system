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

const loader = require("../src/loader.js");
const loaderError = require("../src/loaderError.js");
const assert = require("assert");
const path = require("path");
const nonExistentFileOrDir = "Non-existent file or directory";

/**
 * Tests for the Loader class.
 * @member Loader
 * @memberof module:system~test
 */
function testLoader(){
	describe("Loader", function() {
		describe("constructor", function(){
			it("should produce unexpected_constructor error, with incoherent args", function(){
				assert.throws(
					function(){
						new loader.Loader("string", null, "string", null); /* eslint-disable-line no-new */// "new Loader" is only used for side-effects of testing
					},
					function(error){
						return ((error instanceof loaderError.LoaderError) && error.code === "unexpected_constructor");
					}
				);
			});
			it("should not fail as a dummy", function(){
				new loader.Loader(null); /* eslint-disable-line no-new */// "new Loader" is only used for side-effects of testing
			});
			it("should produce \"Invalid intialization entry type - average_height\", when called with respective initialization file", function(){
				new loader.Loader("test", "trees", "init", function(load){ /* eslint-disable-line no-new */// "new Loader" is only used for side-effects of testing
					load.catch(function(err){
						assert.throws(
							function(){
								throw err;
							},
							function(error){
								return ((error instanceof Error) && error.message === "Invalid intialization entry type - average_height");
							}
						);
					});
				});
			});
		});
		const loaders = [
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
					},
					{
						child: "barnards_star",
						grandChild: "planet0",
						value: "Barnard's Star b"
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
						value: 17
					},
					{
						child: "branch",
						grandChild: "branch_stock",
						greatGrandChild: "cabbages",
						value: 87
					},
					{
						child: "branch",
						grandChild: "branch_stock",
						greatGrandChild: "oranges",
						value: 49
					},
					{
						child: "branch",
						grandChild: "branch_stock",
						greatGrandChild: "pineapples",
						value: 16
					},
					{
						child: "branch",
						grandChild: "branch_stock",
						greatGrandChild: "carrots",
						value: 50
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
			},
			{
				name: "Cars",
				rootDir: "test",
				dir: "cars",
				file: "init",
				rawFilename: "init.yml",
				filesAndFoldersAmount: 1,
				constructorError: "Invalid intialization entry type - trucks"
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
				let constructorErrorOk;
				before(function(done){
					loaderTest = new loader.Loader(element.rootDir, element.dir, element.file, load => {
						if(element.hasOwnProperty("constructorError")){
							constructorErrorOk = assert.rejects(load, function(error){
								return ((error instanceof Error) && error.message === "Invalid intialization entry type - trucks");
							});
						} else {
							constructorErrorOk = assert.doesNotReject(load);
						}
						done();
					});
				});

				describe("constructor", function(){
					it("should " + (element.hasOwnProperty("constructorError") ? "reject with" + element.hasOwnProperty("constructorError") : "not reject"), function(){
						return assert.doesNotReject(constructorErrorOk);
					});
				});

				if(element.hasOwnProperty("grandChildrenCompare")){
					if(element.grandChildrenCompare.length > 0){
						element.grandChildrenCompare.forEach(function(compare){
							describe("#" + compare.child + "." + compare.grandChild, function() {
								it("should be " + compare.value, function(done) {
									assert.strictEqual(loaderTest[compare.child][compare.grandChild], compare.value);
									done();
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
									assert.strictEqual(loaderTest[compare.child][compare.grandChild][compare.greatGrandChild], compare.value);
									done();
								});
							});
						});
					}
				}

				describe(".list(\"" + element.rootDir + "\", \"" + element.dir + "\")", function(){
					it("should have a length of " + element.filesAndFoldersAmount.toString() + "with args", function(done) {
						loader.Loader.list(element.rootDir, element.dir).then(function(result){
							assert.strictEqual(result.length, element.filesAndFoldersAmount);
							done();
						});
					});
					it("should reject with args", function() {
						assert.rejects(loader.Loader.list(element.rootDir, "Some text."));
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
						assert.strictEqual(loader.Loader.toRelative(element.rootDir, absolutePath), element.dir);
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
						assert.strictEqual(loader.Loader.join(element.rootDir, element.dir), expectedPath);
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
							assert.strictEqual(result, true);
							done();
						});
					});
					it("should not be a directory with args (\"" + element.rootDir + "\", \"" + element.dir + path.sep + element.rawFilename + "\")", function(done){
						loader.Loader.isFile(element.rootDir, "." + path.sep ,element.dir).then(function(result){
							assert.strictEqual(result, false);
							done();
						});
					});
					it("should not be a directory with args (\"" + element.rootDir + "\", \"" + nonExistentFileOrDir + "\")", function(done){
						loader.Loader.isFile(element.rootDir, "." + path.sep, nonExistentFileOrDir).then(function(result){
							assert.strictEqual(result, false);
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
							assert.strictEqual(result, true);
							done();
						});
					});

					it("should not be a directory with args (\"" + element.rootDir + "\", \"" + element.dir + path.sep + element.rawFilename + "\")", function(done){
						loader.Loader.isDir(element.rootDir, loader.Loader.join(element.dir, element.rawFilename)).then(function(result){
							assert.strictEqual(result, false);
							done();
						});
					});

					it("should not be a directory with args (\"" + element.rootDir + "\", \"" + nonExistentFileOrDir + "\")", function(done){
						loader.Loader.isDir(element.rootDir, nonExistentFileOrDir).then(function(result){
							assert.strictEqual(result, false);
							done();
						});
					});
				});
			});
		});
	});
}
module.exports = {
	testLoader
}