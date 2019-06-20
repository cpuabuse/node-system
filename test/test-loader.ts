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

/** Default string for absent file. */
const nonExistentFileOrDir: string = "Non-existent file or directory";

/** Test data for loader. */
interface Test {
	/** Constructor error. */
	constructorError?: string;

	/** Relative directory. */
	dir: string;

	/** File name. */
	file: string;

	/** Amount of files and folders. */
	filesAndFoldersAmount: number;

	/** Object grandchildren. */
	grandChildrenCompare?: Array<TestGrandChild>;

	/** Object great grand children for comparison. */
	greatGrandChildrenCompare?: Array<TestGreatGrandChild>;

	/** Name of the loader. */
	name: string;

	/** Raw file name. */
	rawFilename: string;

	/** Root directory. */
	rootDir: string;
}
/** Test data for grandchildren comparison. */
interface TestGrandChild {
	/** Object child name. */
	child: string;

	/** Object grandchild name. */
	grandChild: string;

	/** Expected value. */
	value: string;
}

/** Test data for greatgrandchildren comparison. */
interface TestGreatGrandChild {
	/** Object child name. */
	child: string;

	/** Object granchild name. */
	grandChild: string;

	/** Great grand child name. */
	greatGrandChild: string;

	/** Expected value. */
	value: number;
}

/**
 * Tests for the Loader class.
 */
export function testLoader(): void {
	describe("Loader", function(): void {
		/**
		 * Tests the constructor for:
		 *
		 * - "unexpected_constructor" error
		 * - Non-failure with dummy
		 * - "Invalid intialization entry type" error
		 */
		describe("constructor", function(): void {
			it("should produce unexpected_constructor error, with incoherent args", function(): void {
				assert.throws(
					function(): void {
						/* eslint-disable-next-line no-new */ /* tslint:disable-next-line no-unused-expression */ // "new Loader" is only used for side-effects of testing
						new Loader("string", null, "string", null);
					},
					function(error: LoaderError | Error): boolean {
						return error instanceof LoaderError && error.code === "unexpected_constructor";
					}
				);
			});
			it("should not fail as a dummy", function(): void {
				/* eslint-disable-next-line no-new */ /* tslint:disable-next-line no-unused-expression */ // "new Loader" is only used for side-effects of testing
				new Loader(null, null, null, null);
			});
			it('should produce "Invalid intialization entry type - average_height", when called with respective initialization file', function(): void {
				/* eslint-disable-next-line no-new */ /* tslint:disable-next-line no-unused-expression */ // "new Loader" is only used for side-effects of testing
				new Loader("test", "trees", "init", function(load: Promise<void>): void {
					load.catch(function(err: LoaderError | Error): void {
						assert.throws(
							function(): void {
								throw err;
							},
							function(error: LoaderError | Error): boolean {
								return error instanceof Error && error.message === "Invalid intialization entry type - average_height";
							}
						);
					});
				});
			});
		});

		/** Tests that function produces appropriate object from YAML string. */
		describe(".yamlToObject()", function(): void {
			let data: string = "Wine: Red";
			let expectedResults: { Wine: string } = {
				Wine: "Red"
			};
			it("should produce JSON", function(): void {
				assert.deepEqual(Loader.yamlToObject(data), expectedResults);
			});
		});

		const loaders: Array<Test> = [
			// Stars
			{
				dir: "stars",
				file: "stars",
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
				],
				name: "Stars",
				rawFilename: "stars.yml",
				rootDir: "test"
			},
			// Flower Shop
			{
				dir: "flowerShop",
				file: "init",
				filesAndFoldersAmount: 8,
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
				],
				name: "Flower Shop",
				rawFilename: "init.yml",
				rootDir: "test"
			},
			// Example
			{
				dir: "example",
				file: "init",
				filesAndFoldersAmount: 5,
				name: "Example",
				rawFilename: "init.yml",
				rootDir: "test"
			},
			// Cars
			{
				constructorError: "Invalid intialization entry type - trucks",
				dir: "cars",
				file: "init",
				filesAndFoldersAmount: 1,
				name: "Cars",
				rawFilename: "init.yml",
				rootDir: "test"
			}
		];
		loaders.forEach(function(element: Test): void {
			describe(element.name, function(): void {
				let loaderTest: Loader;
				let constructorErrorOk: Promise<Error>;
				before(function(done: () => void): void {
					loaderTest = new Loader(element.rootDir, element.dir, element.file, (load: Promise<void>): void => {
						if (Object.prototype.hasOwnProperty.call(element, "constructorError")) {
							constructorErrorOk = (assert.rejects(load, function(error: LoaderError | Error): boolean {
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
				describe("constructor", function(): void {
					let should: string = Object.prototype.hasOwnProperty.call(element, "constructorError")
						? `reject with "${element.constructorError}"`
						: "not reject";
					it(`should ${should}`, function(): Promise<void> {
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
						element.grandChildrenCompare.forEach(function(compare: TestGrandChild): void {
							describe(`#${compare.child}.${compare.grandChild}`, function(): void {
								it(`should be ${compare.value}`, function(done: () => void): void {
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
						element.greatGrandChildrenCompare.forEach(function(compare: TestGreatGrandChild): void {
							describe(`#${compare.child}.${compare.grandChild}.${compare.greatGrandChild}`, function(): void {
								it(`should be ${compare.value}`, function(done: () => void): void {
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
				describe(`.list("${element.rootDir}", "${element.dir}")`, function(): void {
					it(`should have a length of ${element.filesAndFoldersAmount.toString()} with args"`, function(done: () => void): void {
						Loader.list(element.rootDir, element.dir).then(function(result: Array<string>): void {
							assert.strictEqual(result.length, element.filesAndFoldersAmount);
							done();
						});
					});
					it("should reject with args", function(): void {
						assert.rejects(Loader.list(element.rootDir, "Some text."));
					});
				});

				/**
				 * Tests the toRelative function with:
				 *
				 * - Single argument
				 * - Array as argument
				 */
				describe(".toRelative()", function(): void {
					let absolutePath: string = element.rootDir + path.sep + element.dir; // Absolute path from root
					it(`should be equal to "${element.dir}" with args ("${element.rootDir}", "${absolutePath}")`, function(): void {
						assert.strictEqual(Loader.toRelative(element.rootDir, absolutePath), element.dir);
					});
					it("should work with array", function(): void {
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
				describe(`.join("${element.rootDir}", "${element.dir}")`, function(): void {
					let expectedPath: string = element.rootDir + path.sep + element.dir;
					it(`should be equal to ${expectedPath}`, function(): void {
						assert.strictEqual(Loader.join(element.rootDir, element.dir), expectedPath);
					});
					it("should work with array", function(): void {
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
				describe(`.isFile("${element.rootDir}", "${element.dir}", "${element.rawFilename}")`, function(): void {
					let isFile: Promise<boolean> = Loader.isFile(
						element.rootDir + path.sep + element.dir + path.sep + element.rawFilename
					);
					it(`should be a file with args ("${element.rootDir}${path.sep}${element.dir}${path.sep}${element.rawFilename}")`, function(done: () => void): void {
						isFile.then(function(result: boolean): void {
							assert.strictEqual(result, true);
							done();
						});
					});
					it(`should not be a directory with args ("${element.rootDir}${path.sep}${element.dir}")`, function(done: () => void): void {
						Loader.isFile(element.rootDir + path.sep + element.dir).then(function(result: boolean): void {
							assert.strictEqual(result, false);
							done();
						});
					});
					it(`should not be a directory with args ("${element.rootDir}${path.sep}${nonExistentFileOrDir}")`, function(done: () => void): void {
						Loader.isFile(element.rootDir + path.sep + nonExistentFileOrDir).then(function(result: boolean): void {
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
				describe(".isDir()", function(): void {
					it(`should be a directory with args ("${element.rootDir}", "${element.dir}")`, function(done: () => void): void {
						Loader.isDir(element.rootDir, element.dir).then(function(result: boolean): void {
							assert.strictEqual(result, true);
							done();
						});
					});

					it(`should not be a directory with args ("${element.rootDir}", "${element.dir}${path.sep}${element.rawFilename}")`, function(done: () => void): void {
						Loader.isDir(element.rootDir, Loader.join(element.dir, element.rawFilename) as string).then(function(
							result: boolean
						): void {
							assert.strictEqual(result, false);
							done();
						});
					});

					it(`should not be a directory with args ("${element.rootDir}", "${nonExistentFileOrDir}")`, function(done: () => void): void {
						Loader.isDir(element.rootDir, nonExistentFileOrDir).then(function(result: boolean): void {
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
