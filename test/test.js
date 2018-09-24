"use strict";
const SystemLoader = require("../src/systemLoader.js");

// Checks for function failures across node-system
try {
    // Check SystemLoader functions
    console.log("Checking SystemLoader with dummy...")
    var sl = new SystemLoader.SystemLoader("./", "test/", "stars", () => console.log("Complete"));
} catch (err) {
    console.log(err);
    process.exit(-1);
}