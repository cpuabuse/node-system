import { AtomicLock } from "./atomic";
import { System } from "./system";
export interface ISubsystem extends Subsystem {
    new (args: ConstructorArgs): ISubsystem;
}
/** Interface for subsystem constructor data exchange. */
export interface ConstructorArgs {
    /** Context of a parent system. */
    systemContext: System;
    args: null | {
        system_args?: any;
    };
    /** Arbitrary arguments from a file. */
    vars: any;
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
export declare class Subsystem extends AtomicLock {
    system: System;
    method: Method;
    data: any;
    constructor(systemContext: System, subsystemMethods: Array<SubsystemMethod> | null);
}
export {};
