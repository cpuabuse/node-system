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
		console.log("Test - SystemLoader < Planets...")
		let planets = new SystemLoader.SystemLoader("./test", "stars", "stars", load => {
			load.then(() => {
				console.log(planets);
				console.log("\n");
				resolve();
			});
		});
	}).then(function (){
		return new Promise(function(resolve){
			console.log("Test - System - Latin Classes...")
			var latinClasses = new System.System(
				"flower_shop",
				"./test",
				"flowerShop",
				"init",
				[
					{
						"system_load": () => {
							console.log(latinClasses);
							resolve();
						}
					}
				]
			);
		});
	});
}

test();