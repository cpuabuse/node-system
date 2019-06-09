/*
	File: src/subsystems/system.file.ts
	cpuabuse.com
*/

/** Works with files. */
import { Subsystem, ConstructorArgs } from "../system/subsystem"; /* eslint-disable-line no-unused-vars */ // ESLint bug

/** Class to work with files. */
export default class FileSystem extends Subsystem {
	/** Contains files & file meta-data. */
	private files: any;

	constructor(args: ConstructorArgs) {
		super(args.systemContext, null);
		this.files = args.vars;
	}
}
