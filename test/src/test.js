// test.js
/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
*/
"use strict";
const system = require("../../src/system.js");
const systemError = require("../../src/systemError.js");
const systemLoader = require("../../src/systemLoader.js");
const systemAtomic = require("../../src/systemAtomic.js");
const maxTestWait = 1000;
const starsFolderItemsAmount = 3;

// DEBUG: Devonly - promise throw
process.on("unhandledRejection", up => {
	throw up
});

// Object declarations
var stars, flowerShop;

/**
 * Reject function
*/
function timeoutReject(reject){
	return setTimeout(() => {
		reject("Test took too long to execute.");
	}, maxTestWait);
}

/**
 * Test function
*/
function test(){
	new Promise(function(resolve, reject){
		console.log("System test: SystemLoader < Stars...")
		let timeout = timeoutReject(reject);

		stars = new systemLoader.SystemLoader("./test", "stars", "stars", load => {
			load.then(() => {
				if (stars.sol.planet2 != "Earth"){
					throw new Error("Earth is not 3rd planet. Error in System Loader.");
				}
				console.log(stars);
				console.log("");
				clearTimeout(timeout);
				resolve();
			});
		});
	}).then(function(){
		return new Promise(function(resolve, reject){
			// Begin test
			console.log("System test: SystemLoader - File functions...");
			let timeout = timeoutReject(reject);

			// Test
			systemLoader.SystemLoader.list("./test", "stars").then(function(result){
				if(result.length != starsFolderItemsAmount){
					throw new Error("Amount of items in stars folder is != " + starsFolderItemsAmount);
				}
				console.log("Amount of items in stars folder is = " + starsFolderItemsAmount);

				// End test
				console.log("");
				clearTimeout(timeout);
				resolve();
			})
		})
	}).then(function(){
		return new Promise(function(resolve, reject){
			console.log("System test: System - Flower shop...")
			let timeout = timeoutReject(reject);
			flowerShop = new system.System(
				"flower_shop",
				"./test",
				"flowerShop",
				"init",
				[
					{
						"system_load": () => {
							console.log(flowerShop);
							console.log("");
							clearTimeout(timeout);
							resolve();
						}
					}
				]
			);
		});
	}).then(function(){
		return new Promise(function(resolve, reject){
			console.log("System test: System - Flower shop errors...")
			let timeout = timeoutReject(reject);

			let flowerShopErrorCode = "all_flowers_gone";

			// Test for expected error behavior
			try {
				throw flowerShop.system.error.all_flowers_gone;
			} catch(error) {
				if(error.code != flowerShopErrorCode){
					throw new Error("SystemError does not retain error code || System does not contain " + flowerShopErrorCode + " error.");
				}
				console.log(error.code + " == " + flowerShopErrorCode);
			}

			// Test for incorrect error
			if(systemError.SystemError.isSystemError(flowerShop.system.error.carShopErrorCode)){
				throw new Error("Unknown error is viewed as system error");
			}
			console.log("carShopErrorCode is not an error");

			console.log("");
			clearTimeout(timeout);
			resolve();
		});
	}).then(function(){
		return new Promise(function(resolve, reject){
			console.log("System test: AtomicLock - Testing virtual atomic operations")
			let timeout = timeoutReject(reject);

			// Assing variables
			var atomicLock = new systemAtomic.AtomicLock();

			// Test for initial state
			if (atomicLock.locked != false) {
				throw new Error("AtomicLock failed to initialize.");
			}

			// Test for lock
			atomicLock.lock();
			if (atomicLock.locked != true) {
				throw new Error("AtomicLock failed to lock.");
			}

			console.log("AtomicLock has initialized and performed a lock.");
			console.log("");
			clearTimeout(timeout);
			resolve();
		});
	}).then(function() {
		console.log("System test: Tests complete.");
	});
}

test();