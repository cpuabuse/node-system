// test.js
/**
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
*/
"use strict";
const SystemLoader = require("../src/systemLoader.js");
const System = require("../src/system.js");

// Check SystemLoader functions
console.log("Checking SystemLoader with dummy...")
var sl = new SystemLoader.SystemLoader("./test", "stars", "stars", (load) => {
	load.then(function(){
		console.log(sl);
		console.log("Complete");
	});
});


var sl2 = new System.System("flower_shop", "./test", "flowerShop", "init");