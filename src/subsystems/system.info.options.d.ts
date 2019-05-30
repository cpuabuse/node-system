import { ConstructorArgs } from "../subsystem";
import Info from "./system.info";
import { SystemArgs } from "../system";
interface OptionsVars {
    homepage: string;
}
export interface OptionsInterface extends SystemArgs, OptionsVars {
}
export default class Options extends Info {
    constructor(args: ConstructorArgs);
}
export {};
