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

// System Instances
describe("System", function() {
	// Array of testing unit initialization data
	var systems = [
		{ // Example
			options: {
				id: "example",
				rootDir: "./test",
				relativeInitDir: "example",
				initFilename: "init",
				notMute: false
			}
		},
		{ // Flower shop
			options: {
				id: flowerShop2Id,
				rootDir: "./test",
				relativeInitDir: "flowerShop",
				initFilename: "init",
				notMute: false
			},
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

			// System property of System instance
			describe("#system", function(){
				// System instance ID
				describe("id", function(){
					it("should be " + element.options.id, function(done) {
						systemTestLoad.then(function(){
							assert.equal(systemTest.system.id, element.options.id);
							done();
						})
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
											systemTestLoad.then(function(){
												if (systemError.SystemError.isSystemError(systemTest.system.error[error])){
													done();
												}
											});
										});
										it("should be " + error, function(done) {
											systemTestLoad.then(function(){
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
							});
						}

						if (element.error.hasOwnProperty("stringErrors")){
							describe("stringErrors", function(){
								element.error.stringErrors.forEach(function(error){
									describe(error, function(){
										it("should not be SystemError", function(done){
											systemTestLoad.then(function(){
												if(!systemError.SystemError.isSystemError(error)){
													done();
												}
											});
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