// test.js
/** 
 * Performs basic tests.
 * If error is thrown, node will exit with code 1, otherwise 0.
*/
"use strict";
const SystemLoader = require("../src/systemLoader.js");

// Check SystemLoader functions
console.log("Checking SystemLoader with dummy...")
var sl = new SystemLoader.SystemLoader("./", "test/", "stars");
sl.load.then(function(){
	console.log(sl.data);
	console.log("Complete");
});