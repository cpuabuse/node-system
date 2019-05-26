import { ConstructorArgs } from "../subsystem";
import Info from "./system.info";
export interface OptionsInterface {
    id: string;
    rootDir: string;
    relativeInitDir: string;
    initFilename: string;
    logging: string;
}
export default class Options extends Info {
    constructor(args: ConstructorArgs);
}
