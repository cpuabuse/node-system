/*
	File: src/subsystems/system.file.ts
	cpuabuse.com
*/

/** Works with files. */
import {
	Subsystem,
	SubsystemExtensionArgs as Args /* eslint-disable-line no-unused-vars */ // ESLint bug
} from "../system/subsystem";

/** Class to work with files. */
export default class FileSystem extends Subsystem {
	/** Contains files & file meta-data. */
	private files: any;

	constructor(args: Args) {
		super(args.systemContext, null);
		this.files = args.vars;
	}
}
