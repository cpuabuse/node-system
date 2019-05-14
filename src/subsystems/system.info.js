// info.js
/*
	Subsystem info.
*/
"use strict";
const path = require("path");
const subsystem = require(".." + path.sep + "subsystem.js");

class Info extends subsystem.Subsystem(){
	constructor(systemArgs, constructorArgs, ...subsystemArgs){
		super(...subsystemArgs);
	}
}

module.exports = Info;