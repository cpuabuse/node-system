// test.js
/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
*/
"use strict";
const system = require("../src/system.js");
const systemError = require("../src/systemError.js");
const systemLoader = require("../src/systemLoader.js");
const maxTestWait = 1000;

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
			console.log("System test: - System - Flower shop errors...")
			let timeout = timeoutReject(reject);

			let flowerShopErrorCode = "all_flowers_gone";
			let carShopErrorCode = "all_cars_gone";
			let systemErrorFailResponse = "System error undefined.";
			let throwTestError = function (errorCode){
				throw new systemError.SystemError(flowerShop, errorCode, "Testing SystemError");
			}

			// Test for expected error behavior
			try {
				throwTestError(flowerShopErrorCode);
			} catch(error) {
				if(error.code != flowerShopErrorCode){
					throw new Error("SystemError does not retain error code || System does not contain " + flowerShopErrorCode + " error.");
				}
				console.log(error.code + " == " + flowerShopErrorCode);
			}

			// Test for unexpected error behavior
			try {
				throwTestError(carShopErrorCode);
			} catch(error) {
				if(error.message != systemErrorFailResponse){
					throw new Error("SystemError has not failed with carShopErrorCode: " + carShopErrorCode + ", but should have.");
				}
				console.log(error.message + " == " + carShopErrorCode);
			}

			console.log("");
			clearTimeout(timeout);
			resolve();
		});
	}).then(function() {
		console.log("System test: Tests complete.");
	});
}

test();