import { System } from "./system";
/**
 * Interface for subsystem constructor data exchange.
 * @typedef ConstructorArgs
 * @property {module:system.System} systemContext Context of a parent system.
 * @property {Object} args Arbitrary arguments.
 */
export interface ConstructorArgs {
    systemContext: System;
    args: any;
}
/**
 * A way methods are transfered to a subsystem.
 * @typedef SubsystemMethod
 * @property {string} name Name of a function.
 * @property {Function} fn Function body, taking arbitrary arguments.
 */
export declare type SubsystemMethod = {
    name: string;
    fn: Function;
};
/**
 * @typedef Method
 */
declare type Method = {
    [key: string]: Function;
};
export declare class Subsystem {
    system: System;
    method: Method;
    constructor(systemContext: System, subsystemMethods: Array<SubsystemMethod>);
}
export {};
