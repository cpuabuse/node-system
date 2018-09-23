const SystemLoader = require("../systemLoader.js");

// Checks for function failures across node-system
try {
    // Check SystemLoader functions
    console.log("Checking function loadYaml with dummy...")
    var sl = new SystemLoader.SystemLoader("./", "test/", "stars");
} catch (err) {
    console.log(err);
    process.exit(-1);
}