// test.js
/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
*/
"use strict";
const System = require("../src/system.js");
const SystemError = require("../src/systemError.js");
const SystemLoader = require("../src/systemLoader.js");
const maxTestWait = 10000;

// DEBUG: Devonly - promise throw
process.on("unhandledRejection", up => {
	throw up
});

// Object declarations
var stars, flowerShop;

/**
 * Test function
*/
function test(){
	new Promise(function(resolve){
		console.log("Test - SystemLoader < Stars...")
		stars = new SystemLoader.SystemLoader("./test", "stars", "stars", load => {
			load.then(() => {
				if (stars.sol.planet2 != "Earth"){
					throw "Earth is not 3rd planet. Error in System Loader."
				}
				console.log(stars);
				console.log("\n");
				resolve();
			});
		});
	}).then(function(){
		return new Promise(function(resolve){
			console.log("Test - System - Flower shop...")
			flowerShop = new System.System(
				"flower_shop",
				"./test",
				"flowerShop",
				"init",
				[
					{
						"system_load": () => {
							console.log(flowerShop);
							console.log("\n");
							resolve();
						}
					}
				]
			);
		});
	}).then(function(){
		return new Promise(function(resolve){
			console.log("Test - System - Flower shop test error...")

			let errorCode = "all_flowers_gone";
			try {
				throw new SystemError.SystemError(flowerShop, errorCode, "Testing SystemError");
			} catch(error) {
				if(error.code != errorCode){
					throw "SystemError does not retain error code || System does not contain " + errorCode + " error.";
				}
				console.log(error.code + " equals " + errorCode);
				console.log("\n");
			}
			resolve();
		});
	});
}

test();