/**
 * Used for storing system options.
 */
import { ConstructorArgs } from "../subsystem";
import Info from "./system.info";
import { ISystemArgs } from "../system";
interface OptionsVars {
    homepage: string;
}
export interface OptionsInterface extends ISystemArgs, OptionsVars {
}
export default class Options extends Info {
    constructor(args: ConstructorArgs);
}
export {};
