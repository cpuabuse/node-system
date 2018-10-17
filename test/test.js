// test.js
/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
*/
"use strict";

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */

const system 				= require("../src/system.js");
const systemError		= require("../src/error.js");
const loader 	= require("../src/loader.js");
const assert 				= require("assert");
const starsFolderItemsAmount = 3;
const waitTime = 200;
const flowerShopErrorCode = "all_flowers_gone";
const flowerShopId = "flower_shop";
const flowerShop2Id = "flower_shop2";


// DEBUG: Devonly - promise throw
process.on("unhandledRejection", up => {
	throw up
});

describe("Loader", function() {
	describe("stars", function(){
		let stars;
		let load = new Promise(function(resolve){
			stars = new loader.Loader("./test", "stars", "stars", load => {
				load.then(() => {
					resolve();
				});
			});
		});

		describe("#sol", function() {
			describe("planet2", function() {
				it("should be Earth", function(done) {
					load.then(function(){
						assert.equal(stars.sol.planet2, "Earth");
						done();
					})
				});
			});
		});

		describe(".list()", function(){
			// Test
			let list = loader.Loader.list("./test", "stars");

			it("should have a length of " + starsFolderItemsAmount.toString(), function(done) {
				list.then(function(result){
					assert.equal(result.length, starsFolderItemsAmount);
					done();
				})
			});
		})
	});
});

describe("System", function() {
	var systems = [
		{ // Flower shop
			options: {
				id: flowerShopId,
				rootDir: "./test",
				relativeInitDir: "flowerShop",
				initFilename: "init",
				notMute: false
			}
		},
		{ // Example
			options: {
				id: flowerShop2Id,
				rootDir: "./test",
				relativeInitDir: "flowerShop",
				initFilename: "init",
				notMute: false
			}
		}
	]

	systems.forEach(function(element) {
		describe(element.options.id, function(){
			let systemTest;
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

			describe("#system", function(){
				describe("id", function(){
					it("should be " + element.options.id, function(done) {
						systemTestLoad.then(function(){
							assert.equal(systemTest.system.id, element.options.id);
							done();
						})
					});
				});

				describe("error", function() {
					describe("all_flowers_gone", function() {
						// It should be a SystemError
						it("should be SystemError", function(done){
							systemTestLoad.then(function(){
								if (systemError.SystemError.isSystemError(systemTest.system.error.all_flowers_gone)){
									done();
								}
							});
						});
						it("should be " + flowerShopErrorCode, function(done) {
							systemTestLoad.then(function(){
								try {
									throw systemTest.system.error.all_flowers_gone;
								} catch(error){
									assert.equal(error.code, flowerShopErrorCode);
									done();
								}
							})
						});
					});

					describe("carShopError", function(){
						it("should not be SystemError", function(done){
							systemTestLoad.then(function(){
								if(!systemError.SystemError.isSystemError("carShopError")){
									done();
								}
							})
						})
					})
				});
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