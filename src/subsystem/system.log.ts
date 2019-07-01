import {
	Access,
	Subsystem,
	SubsystemExtensionArgs as Args /* eslint-disable-line no-unused-vars */ // ESLint bug
} from "../system/subsystem";

/** Class for logging. */
export default class Log extends Subsystem {
	constructor({ system, protectedEntrypoint, publicEntrypoint, vars }: Args) {
		/** Call super class constructor. */
		super({ protectedEntrypoint, publicEntrypoint, system });
		// Add the homepage
		if (Object.prototype.hasOwnProperty.call(vars, "homepage")) {
			this.addData([
				{
					access: Access.private | Access.protected | Access.public,
					name: "homepage",
					obj: vars.homepage
				}
			]);
		}
	}
}
