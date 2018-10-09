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
const systemError		= require("../src/systemError.js");
const systemLoader 	= require("../src/systemLoader.js");
const systemAtomic 	= require("../src/systemAtomic.js");
const assert 				= require("assert");
const starsFolderItemsAmount = 3;
const flowerShopErrorCode = "all_flowers_gone";
const flowerShopId = "flower_shop";
const flowerShopOptions = {
	id: flowerShopId,
	rootDir: "./test",
	relativeInitDir: "flowerShop",
	initFilename: "init",
	notMute: false
};

// DEBUG: Devonly - promise throw
process.on("unhandledRejection", up => {
	throw up
});

describe("SystemLoader", function() {
	describe("stars", function(){
		let stars;
		let load = new Promise(function(resolve){
			stars = new systemLoader.SystemLoader("./test", "stars", "stars", load => {
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
			let list = systemLoader.SystemLoader.list("./test", "stars");

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
	describe("flowerShop", function(){
		let flowerShop;
		let flowerShopLoad = new Promise(function(resolve){
			flowerShop = new system.System(
				flowerShopOptions,
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
				it("should be " + flowerShopId, function(done) {
					flowerShopLoad.then(function(){
						assert.equal(flowerShop.system.id, flowerShopId);
						done();
					})
				});
			});

			describe("error", function() {
				describe("all_flowers_gone", function() {
					it("should be " + flowerShopErrorCode, function(done) {
						flowerShopLoad.then(function(){
							try {
								throw flowerShop.system.error.all_flowers_gone;
							} catch(error){
								assert.equal(error.code, flowerShopErrorCode);
								done();
							}
						})
					});
				});

				describe("carShopError", function(){
					it("should not exist", function(done){
						flowerShopLoad.then(function(){
							if(!systemError.SystemError.isSystemError(flowerShop.system.error.carShopError)){
								done();
							}
						})
					})
				})
			});
		});
	});
});

describe("AtomicLock", function() {
	// Assing variables
	let atomicLock = new systemAtomic.AtomicLock();

	describe("initial state", function(){
		it("should be unlocked", function() {
			assert.equal(atomicLock.locked, false);
		});
	});

	describe("locked state", function(){
		it("should be locked", function() {
			atomicLock.lock();
			assert.equal(atomicLock.locked, true);
		});
	});
});