/*
	File: test/test-loader.ts
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
import { Loader } from "../src/loader";
import { LoaderError } from "../src/loaderError";

const nonExistentFileOrDir = "Non-existent file or directory";

/**
 * Tests for the Loader class.
 */
export function testLoader() {
	describe("Loader", function loaderLoader() {
		/**
		 * Tests the constructor for:
		 *
		 * - "unexpected_constructor" error
		 * - Non-failure with dummy
		 * - "Invalid intialization entry type" error
		 */
		describe("constructor", function loaderConstructor() {
			it("should produce unexpected_constructor error, with incoherent args", function loaderConstructorUnexpected() {
				assert.throws(
					function loaderConstructorUnexpectedThrowsFn() {
						new Loader /* eslint-disable-line no-new */("string", null, "string", null); // "new Loader" is only used for side-effects of testing
					},
					function loaderConstructorUnexpectedThrowsError(error: LoaderError | Error) {
						return error instanceof LoaderError && error.code === "unexpected_constructor";
					}
				);
			});
			it("should not fail as a dummy", function loaderConstructorDummy() {
				new Loader(null, null, null, null); /* eslint-disable-line no-new */ // "new Loader" is only used for side-effects of testing
			});
			it('should produce "Invalid intialization entry type - average_height", when called with respective initialization file', function loaderConstructorInvalid() {
				/* eslint-disable-next-line no-new */ // "new Loader" is only used for side-effects of testing
				new Loader("test", "trees", "init", function loaderConstructorInvalidLoad(load) {
					load.catch(function loaderConstructorInvalidCatch(err) {
						assert.throws(
							function loaderConstructorInvalidThrows() {
								throw err;
							},
							function loaderConstructorInvalidError(error: LoaderError | Error) {
								return error instanceof Error && error.message === "Invalid intialization entry type - average_height";
							}
						);
					});
				});
			});
		});

		/** Tests that function produces appropriate object from YAML string. */
		describe(".yamlToObject()", function loaderYaml() {
			let data = "Wine: Red";
			let expectedResults = {
				Wine: "Red"
			};
			it("should produce JSON", function loaderJson() {
				assert.deepEqual(Loader.yamlToObject(data), expectedResults);
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
				filesAndFoldersAmount: 9,
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
				filesAndFoldersAmount: 6
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
		loaders.forEach(function(element) {
			describe(element.name, function() {
				let loaderTest: Loader;
				let constructorErrorOk: Promise<Error>;
				before(function(done) {
					loaderTest = new Loader(element.rootDir, element.dir, element.file, load => {
						if (Object.prototype.hasOwnProperty.call(element, "constructorError")) {
							constructorErrorOk = (assert.rejects(load, function(error: LoaderError | Error) {
								return error instanceof Error && error.message === "Invalid intialization entry type - trucks";
							}) as unknown) as Promise<Error>; // @types declaration mismatch
						} else {
							constructorErrorOk = (assert.doesNotReject(load) as unknown) as Promise<Error>; // @types declaration mismatch
						}
						done();
					});
				});

				/**
				 * Constructor should either reject or not.
				 */
				describe("constructor", function() {
					let should = Object.prototype.hasOwnProperty.call(element, "constructorError")
						? `reject with "${element.constructorError}"`
						: "not reject";
					it(`should ${should}`, function() {
						return assert.doesNotReject(constructorErrorOk);
					});
				});

				/**
				 * Checks for instance grandchildren values.
				 */
				if (Object.prototype.hasOwnProperty.call(element, "grandChildrenCompare")) {
					// @ts-ignore We checked for grandChildrenCompare
					if (element.grandChildrenCompare.length > 0) {
						// @ts-ignore We checked for grandChildrenCompare
						element.grandChildrenCompare.forEach(function(compare) {
							describe(`#${compare.child}.${compare.grandChild}`, function() {
								it(`should be ${compare.value}`, function(done) {
									assert.strictEqual(
										// TODO: Ignore for now
										// @ts-ignore
										loaderTest[compare.child][compare.grandChild],
										compare.value
									);
									done();
								});
							});
						});
					}
				}

				/** Checks for instance greatgrandchildren values. */
				if (Object.prototype.hasOwnProperty.call(element, "greatGrandChildrenCompare")) {
					// @ts-ignore We checked for greatGrandChildrenCompare
					if (element.greatGrandChildrenCompare.length > 0) {
						// @ts-ignore We checked for greatGrandChildrenCompare
						element.greatGrandChildrenCompare.forEach(function(compare) {
							describe(`#${compare.child}.${compare.grandChild}.${compare.greatGrandChild}`, function() {
								it(`should be ${compare.value}`, function(done) {
									assert.strictEqual(
										// TODO: Ignore for now
										// @ts-ignore
										loaderTest[compare.child][compare.grandChild][compare.greatGrandChild],
										compare.value
									);
									done();
								});
							});
						});
					}
				}

				/**
				 * Tests the list function for:
				 *
				 * - List length consistency
				 * - Rejection with inconsistent args
				 */
				describe(`.list("${element.rootDir}", "${element.dir}")`, function() {
					it(`should have a length of ${element.filesAndFoldersAmount.toString()} with args"`, function(done) {
						Loader.list(element.rootDir, element.dir).then(function(result) {
							assert.strictEqual(result.length, element.filesAndFoldersAmount);
							done();
						});
					});
					it("should reject with args", function() {
						assert.rejects(Loader.list(element.rootDir, "Some text."));
					});
				});

				/**
				 * Tests the toRelative function with:
				 *
				 * - Single argument
				 * - Array as argument
				 */
				describe(".toRelative()", function() {
					let absolutePath = element.rootDir + path.sep + element.dir; // Absolute path from root
					it(`should be equal to "${element.dir}" with args ("${element.rootDir}", "${absolutePath}")`, function() {
						assert.strictEqual(Loader.toRelative(element.rootDir, absolutePath), element.dir);
					});
					it("should work with array", function() {
						assert.deepEqual(Loader.toRelative(element.rootDir, [absolutePath, absolutePath]), [
							element.dir,
							element.dir
						]);
					});
				});

				/**
				 * Tests the join function with:
				 *
				 * - Single argument
				 * - Array as argument
				 */
				describe(`.join("${element.rootDir}", "${element.dir}")`, function() {
					let expectedPath = element.rootDir + path.sep + element.dir;
					it(`should be equal to ${expectedPath}`, function() {
						assert.strictEqual(Loader.join(element.rootDir, element.dir), expectedPath);
					});
					it("should work with array", function() {
						assert.deepEqual(Loader.join(element.rootDir, [element.dir, element.dir]), [expectedPath, expectedPath]);
					});
				});

				/**
				 * Tests the isFile for:
				 *
				 * - Being a file
				 * - Not being a file for a directory
				 * - Not being a file for non-existant file
				 */
				describe(`.isFile("${element.rootDir}", "${element.dir}", "${element.rawFilename}")`, function() {
					let isFile = Loader.isFile(element.rootDir + path.sep + element.dir + path.sep + element.rawFilename);
					it(`should be a file with args ("${
						element.rootDir
					}${path.sep}${element.dir}${path.sep}${element.rawFilename}")`, function(done) {
						isFile.then(function(result) {
							assert.strictEqual(result, true);
							done();
						});
					});
					it(`should not be a directory with args ("${element.rootDir}${path.sep}${element.dir}")`, function(done) {
						Loader.isFile(element.rootDir + path.sep + element.dir).then(function(result) {
							assert.strictEqual(result, false);
							done();
						});
					});
					it(`should not be a directory with args ("${
						element.rootDir
					}${path.sep}${nonExistentFileOrDir}")`, function(done) {
						Loader.isFile(element.rootDir + path.sep + nonExistentFileOrDir).then(function(result) {
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
				 */
				describe(".isDir()", function() {
					it(`should be a directory with args ("${element.rootDir}", "${element.dir}")`, function(done) {
						Loader.isDir(element.rootDir, element.dir).then(function(result) {
							assert.strictEqual(result, true);
							done();
						});
					});

					it(`should not be a directory with args ("${
						element.rootDir
					}", "${element.dir}${path.sep}${element.rawFilename}")`, function(done) {
						Loader.isDir(element.rootDir, Loader.join(element.dir, element.rawFilename) as string).then(function(
							result
						) {
							assert.strictEqual(result, false);
							done();
						});
					});

					it(`should not be a directory with args ("${element.rootDir}", "${nonExistentFileOrDir}")`, function(done) {
						Loader.isDir(element.rootDir, nonExistentFileOrDir).then(function(result) {
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
};
