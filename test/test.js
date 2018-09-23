const SystemLoader = require("../systemLoader.js");

// Checks for function failures across node-system
try {
    // Check SystemLoader functions
    console.log("Checking function loadYaml with dummy test.yml")
    SystemLoader.loadYaml("test/test");
} catch (err) {
    console.log(err);
    process.exit(-1);
}
