// test.js
/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
*/
"use strict";
const SystemLoader = require("../src/systemLoader.js");
const System = require("../src/system.js");
const maxTestWait = 10000;

/**
 * Test function
*/
function test(){
	new Promise(function (resolve){
		console.log("Test - SystemLoader < Stars...")
		let stars = new SystemLoader.SystemLoader("./test", "stars", "stars", load => {
			load.then(() => {
				if (stars.sol.planet2 != "Earth"){
					throw "Earth is not 3rd planet. Error in System Loader."
				}
				console.log(stars);
				console.log("\n");
				resolve();
			});
		});
	}).then(function (){
		return new Promise(function(resolve){
			console.log("Test - System - Flower Shop...")
			var flowerShop = new System.System(
				"flower_shop",
				"./test",
				"flowerShop",
				"init",
				[
					{
						"system_load": () => {
							console.log(flowerShop);
							resolve();
						}
					}
				]
			);
		});
	});
}

test();