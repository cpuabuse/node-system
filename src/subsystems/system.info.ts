// info.ts
/*
	Subsystem info.
*/
"use strict";
import {Subsystem, ConstructorArgs} from "../subsystem";
import {System} from "../system";

class Info extends Subsystem{
	constructor(args:ConstructorArgs){
		super(args.systemContext, null);
	}
}

module.exports = Info;